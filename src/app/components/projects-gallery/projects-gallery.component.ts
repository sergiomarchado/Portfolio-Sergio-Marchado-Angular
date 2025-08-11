import { Component, computed, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project, ProjectCategory } from '../../interfaces/project.interface';
import { PROJECTS } from '../../data/projects.data';

type FilterKey = 'ALL' | ProjectCategory;

type ScrollState = {
  can: boolean;
  atTop: boolean;
  atBottom: boolean;
  thumbH: number;   // % relativo al alto visible
  thumbTop: number; // % relativo al alto visible
};

@Component({
  selector: 'app-projects-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects-gallery.component.html',
  styleUrl: './projects-gallery.component.css'
})
export class ProjectsGalleryComponent implements OnDestroy {

  /** Categorías disponibles para filtrar (incluye ALL) */
  readonly categories: FilterKey[] = ['ALL', 'ANDROID', 'JAVA/BACK', 'ANGULAR', 'PYTHON'];

  /** Filtro activo (Signal) */
  active = signal<FilterKey>('ALL');

  /** Fuente de datos (Signal) */
  projects = signal<Project[]>(PROJECTS);

  /** Card abierta actualmente (por id); null = ninguna */
  openedId = signal<string | null>(null);

  /** Estado de scroll por id de proyecto (para fades y scrollbar custom) */
  private scrollStates = signal<Record<string, ScrollState>>({});

  /** Mapa de ResizeObservers por card para recalcular el thumb al cambiar tamaño */
  private roMap = new Map<string, ResizeObserver>();

  /**
   * Lista filtrada de proyectos (reactiva via computed).
   * - Si active === 'ALL' => devuelve todos.
   * - Si no => filtra por categoría incluida en el proyecto.
   */
  filtered = computed(() => {
    const key = this.active();
    if (key === 'ALL') return this.projects();
    return this.projects().filter(p => p.categories.includes(key));
  });

  /**
   * Cambia el filtro activo y cierra la card abierta (si la hay).
   * Razón UX: al cambiar de filtro, evitamos que quede una card abierta que ya no pertenece al resultado.
   */
  setFilter(key: FilterKey) {
    this.active.set(key);
    this.openedId.set(null);
  }

  /** trackBy para *ngFor de proyectos: evita recrear DOM innecesariamente */
  trackById = (_: number, p: Project) => p.id;

  /**
   * Alterna apertura de una card.
   * Paso a paso:
   *  1) Si el click proviene de un botón/enlace dentro de la card, NO togglear (deja que el botón navegue).
   *  2) Calcula el siguiente estado (mismo id => cerrar; distinto => abrir).
   *  3) Si se abre, encola un microtask para esperar el render y luego:
   *     - Selecciona el contenedor de scroll de la card abierta (.meta-scroll).
   *     - Adjunta ResizeObserver y calcula estado de scroll (thumb/posiciones).
   */
  toggleCard(id: string, ev?: Event) {
    if (ev) {
      const target = ev.target as HTMLElement;
      if (target.closest('button,a')) return;
    }
    const current = this.openedId();
    const next = current === id ? null : id;
    this.openedId.set(next);

    if (next) {
      // recalculo tras abrir
      queueMicrotask(() => {
        const el = document.querySelector<HTMLElement>(`article.card.open .meta-scroll`);
        if (el) this.attachAndUpdate(id, el);
      });
    }
  }

  /**
   * Accesibilidad por teclado:
   * - Enter / Space => toggle
   * - Escape => cerrar si la card está abierta
   */
  onKeydown(ev: KeyboardEvent, id: string) {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      this.toggleCard(id);
    } else if (ev.key === 'Escape' && this.openedId() === id) {
      this.openedId.set(null);
    }
  }

  /** ¿La card con este id está abierta? (para clases/atributos ARIA) */
  isOpen(id: string) {
    return this.openedId() === id;
  }

  /**
   * CTA externa (GitHub/Demo):
   * - stopPropagation para que el click NO cierre/abra la card
   * - abre en nueva pestaña con 'noopener' por seguridad
   */
  openProject(ev: MouseEvent, url?: string | null) {
    ev.stopPropagation();
    if (!url) return;
    window.open(url, '_blank', 'noopener');
  }

  /**
   * Devuelve el estado de scroll para una card.
   * - Si no hay estado calculado aún, retorna un “safe default” (sin overflow).
   */
  state(id: string): ScrollState {
    return this.scrollStates()[id] ?? { can: false, atTop: true, atBottom: true, thumbH: 100, thumbTop: 0 };
  }

  /**
  * Asegura que la card tenga observer/estado inicial cuando el usuario
  *    entra con hover/focus/touch por primera vez.
  */
  ensureState(el: HTMLElement, id: string) {
    this.attachAndUpdate(id, el);
  }

  /** Handler de scroll del contenedor interno: actualiza el estado en tiempo real */
  onScroll(el: HTMLElement, id: string) {
    this.updateScrollState(id, el);
  }

  /**
   * Vincula un ResizeObserver (si no existe para ese id) y recalcula el estado.
   * Motivo: si cambia el alto del contenedor (p. ej., responsive o fuentes), el tamaño del thumb debe ajustarse.
   */
  private attachAndUpdate(id: string, el: HTMLElement) {
    this.updateScrollState(id, el);

    if (!this.roMap.has(id)) {
      const ro = new ResizeObserver(() => this.updateScrollState(id, el));
      ro.observe(el);
      this.roMap.set(id, ro);
    }
  }

  /**
   * 📐 Cálculo exacto del thumb y su posición, con mínimo en PX para que siempre sea visible.
   * Método “paso a paso”:
   *  Paso 1) Leer métricas actuales del contenedor:
   *          - scrollTop (desplazamiento), clientHeight (alto visible), scrollHeight (alto total contenido)
   *  Paso 2) Derivar flags:
   *          - can => hay overflow (scrollHeight > clientHeight)
   *          - atTop, atBottom => con tolerancia de 1px para evitar parpadeos
   *  Paso 3) Definir mínimo del thumb en píxeles (MIN_THUMB_PX = 22)
   *  Paso 4) Si hay overflow:
   *          4.1) Calcular altura ideal del thumb: clientH^2 / scrollH (proporción clásica de scrollbar)
   *          4.2) Clampear por mínimo (max(ideal, MIN))
   *          4.3) Calcular la posición máxima posible del thumb (maxTopPx = clientH - thumbPx)
   *          4.4) Progreso real de scroll [0..1] => progress = scrollTop / (scrollH - clientH)
   *          4.5) topPx = clamp(progress * maxTopPx, 0, maxTopPx)
   *          4.6) Convertir thumbPx y topPx a porcentajes relativos al alto visible (clientH)
   *  Paso 5) Persistir el estado en el Signal scrollStates (inmutable: spread + set)
   */
  private updateScrollState(id: string, el: HTMLElement) {
    // Paso 1) Métricas base de scroll
    const scrollTop = el.scrollTop;
    const clientH = el.clientHeight;
    const scrollH = el.scrollHeight;

    // Paso 2) Flags con tolerancia para evitar flicker por redondeos
    const can = scrollH > clientH + 1;
    const atTop = scrollTop <= 1;
    const atBottom = scrollTop + clientH >= scrollH - 1;

    // Paso 3) Tamaño mínimo del thumb en PX (siempre visible)
    const MIN_THUMB_PX = 22;

    let thumbHPercent = 100;
    let thumbTopPercent = 0;

    if (can) {
      // Paso 4.1) Altura ideal en px y clamp a mínimo
      const idealThumbPx = (clientH * clientH) / scrollH; // clientH * (clientH/scrollH)
      const thumbPx = Math.max(idealThumbPx, MIN_THUMB_PX);

      // Paso 4.3-4.5) Posición vertical del thumb en px
      const maxTopPx = Math.max(clientH - thumbPx, 0);
      const denom = Math.max(scrollH - clientH, 1);
      const progress = scrollTop / denom; // 0..1
      const topPx = Math.min(Math.max(progress * maxTopPx, 0), maxTopPx);

      // Paso 4.6) Conversión a porcentajes relativos al contenedor visible
      thumbHPercent = (thumbPx / clientH) * 100;
      thumbTopPercent = (topPx / clientH) * 100;
    }

    // Paso 5) Persistencia inmutable del estado por id
    const next = { ...this.scrollStates() };
    next[id] = { can, atTop, atBottom, thumbH: thumbHPercent, thumbTop: thumbTopPercent };
    this.scrollStates.set(next);
  }

  /**
   * Limpieza global:
   * - Desconecta todos los ResizeObserver registrados.
   * - Limpia el mapa para liberar referencias.
   */
  ngOnDestroy(): void {
    // Limpieza de observers
    this.roMap.forEach(ro => ro.disconnect());
    this.roMap.clear();
  }
}
