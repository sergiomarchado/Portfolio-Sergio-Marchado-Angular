// Componente que muestra una galería de proyectos con filtros por categoría,
// apertura/cierre de tarjetas y un scrollbar "custom" cuya posición y tamaño
// se calculan en función del contenido. Usa Angular Signals y ResizeObserver.

import {
  Component, computed, signal, OnDestroy, AfterViewInit,
  ViewChildren, ElementRef, QueryList, effect, HostListener,
  Injector, inject, DestroyRef, afterNextRender
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project, ProjectCategory } from '../../interfaces/project.interface';
import { PROJECTS } from '../../data/projects.data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Clave de filtro: 'ALL' (todos) o una categoría concreta del proyecto.
type FilterKey = 'ALL' | ProjectCategory;

// Estado de scroll por tarjeta:
// - can: si hay overflow vertical.
// - atTop / atBottom: si el scroll está en los extremos.
// - thumbH / thumbTop: altura y posición del "pulgar" del scrollbar (en % relativo a la altura visible).
type ScrollState = {
  can: boolean;
  atTop: boolean;
  atBottom: boolean;
  thumbH: number;
  thumbTop: number;
};

@Component({
  selector: 'app-projects-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects-gallery.component.html',
  styleUrl: './projects-gallery.component.css'
})
export class ProjectsGalleryComponent implements OnDestroy, AfterViewInit {

  // Lista fija de categorías que se muestran como filtros en la UI.
  readonly categories: FilterKey[] = ['ALL', 'ANDROID', 'JAVA/BACK', 'ANGULAR', 'PYTHON'];

  // Estado reactivo (Signals):
  // - active: filtro elegido.
  // - projects: listado base de proyectos.
  // - openedId: id de la tarjeta abierta (o null si ninguna).
  active = signal<FilterKey>('ALL');
  projects = signal<Project[]>(PROJECTS);
  openedId = signal<string | null>(null);

  // Estados internos:
  // - scrollStates: mapa id -> ScrollState (uno por tarjeta).
  // - roMap: ResizeObservers por tarjeta para recalcular el scrollbar al cambiar el tamaño.
  private scrollStates = signal<Record<string, ScrollState>>({});
  private roMap = new Map<string, ResizeObserver>();

  // Inyección de utilidades del framework:
  // - injector: para dar contexto a APIs que lo requieren (p. ej. effect/afterNextRender).
  // - destroyRef: para auto-darse de baja de streams con takeUntilDestroyed.
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef); // ✅ correcto para takeUntilDestroyed

  // Referencia a todos los elementos marcados con #meta en la plantilla (una por tarjeta).
  @ViewChildren('meta') metas!: QueryList<ElementRef<HTMLElement>>;

  // Lista de proyectos filtrada en función de 'active'.
  // Es un 'computed': se recalcula automáticamente cuando cambian sus dependencias (active/projects).
  filtered = computed(() => {
    const key = this.active();
    if (key === 'ALL') return this.projects();
    return this.projects().filter(p => p.categories.includes(key));
  });

  // Efecto reactivo (Angular Signals):
  // - Declara dependencia de 'filtered' para saber cuándo cambia el set de tarjetas renderizadas.
  // - Usa 'afterNextRender' para ejecutar 'initStates' tras el próximo ciclo de render de Angular,
  //   evitando tocar el DOM demasiado pronto y asegurando que las tarjetas existen en el árbol.
  // - Se crea como inicializador de campo (patrón recomendado): nace con contexto y se limpia solo.
  readonly _recalc = effect(() => {
    this.filtered();
    afterNextRender(() => this.initStates(), { injector: this.injector });
  }, { injector: this.injector });

  // Hook del ciclo de vida: la vista ya está inicializada y podemos medir DOM.
  ngAfterViewInit(): void {
    // Primera inicialización del estado de scroll.
    this.initStates();

    // Nos re-inicializamos cada vez que cambia el QueryList (p. ej. cambio de filtro).
    // takeUntilDestroyed(destroyRef) se ocupa de desuscribir al destruir el componente.
    this.metas.changes
      .pipe(takeUntilDestroyed(this.destroyRef)) // ✅ usa DestroyRef
      .subscribe(() => this.initStates());
  }

  // Recalcular estados cuando cambia el tamaño de la ventana.
  @HostListener('window:resize')
  onResize() { this.initStates(); }

  // Recorre todas las tarjetas (#meta) y adjunta/actualiza su estado de scroll.
  private initStates() {
    this.metas?.forEach(ref => {
      const el = ref.nativeElement;
      const id = el.dataset['id'] || '';
      if (id) this.attachAndUpdate(id, el);
    });
  }

  // Cambiar filtro desde la UI. También cierra cualquier tarjeta abierta.
  setFilter(key: FilterKey) { this.active.set(key); this.openedId.set(null); }

  // trackBy para *ngFor: mejora rendimiento evitando re-creaciones innecesarias.
  trackById = (_: number, p: Project) => p.id;

  // Abre/cierra una tarjeta al hacer click en su contenedor.
  // Si el click viene de un botón/enlace interno, se ignora (para no colisionar con acciones internas).
  toggleCard(id: string, ev?: Event) {
    if (ev) {
      const target = ev.target as HTMLElement;
      if (target.closest('button,a')) return;
    }
    const current = this.openedId();
    this.openedId.set(current === id ? null : id);
  }

  // Accesibilidad: permite abrir/cerrar con Enter o Espacio; Escape cierra si está abierta.
  onKeydown(ev: KeyboardEvent, id: string) {
    if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); this.toggleCard(id); }
    else if (ev.key === 'Escape' && this.openedId() === id) { this.openedId.set(null); }
  }

  // Helpers de estado de apertura y apertura de enlaces externos.
  isOpen(id: string) { return this.openedId() === id; }

  // Abre el enlace del proyecto en nueva pestaña sin permitir que el click burbujee al contenedor.
  openProject(ev: MouseEvent, url?: string | null) {
    ev.stopPropagation();
    if (url) window.open(url, '_blank', 'noopener');
  }

  // NUEVO: abre la demo en vídeo (YouTube/Vimeo/etc.) en nueva pestaña.
  // Mantiene el mismo patrón que openProject: evita burbujeo y usa 'noopener' por seguridad.
  openVideo(ev: MouseEvent, videoUrl?: string | null) {
    ev.stopPropagation();
    if (videoUrl) window.open(videoUrl, '_blank', 'noopener');
  }

  // Devuelve el estado de scroll para un id. Si no existe, devuelve uno por defecto (sin overflow).
  state(id: string): ScrollState {
    return this.scrollStates()[id] ?? { can: false, atTop: true, atBottom: true, thumbH: 100, thumbTop: 0 };
  }

  // Expuestos a la plantilla para forzar cálculo de estado o reaccionar a eventos de scroll.
  ensureState(el: HTMLElement, id: string) { this.attachAndUpdate(id, el); }
  onScroll(el: HTMLElement, id: string) { this.updateScrollState(id, el); }

  // Vincula ResizeObserver a una tarjeta (si no lo tiene) y calcula su estado inicial.
  private attachAndUpdate(id: string, el: HTMLElement) {
    this.updateScrollState(id, el);
    if (!this.roMap.has(id)) {
      const ro = new ResizeObserver(() => this.updateScrollState(id, el));
      ro.observe(el);
      this.roMap.set(id, ro);
    }
  }

  // Calcula los datos del scrollbar custom a partir de las métricas del elemento.
  // - can: si el contenido desborda verticalmente.
  // - atTop/atBottom: extremos del scroll (con tolerancia de 1px).
  // - thumbH/thumbTop: se calcula el tamaño ideal del pulgar y se normaliza a % del alto visible.
  private updateScrollState(id: string, el: HTMLElement) {
    const scrollTop = el.scrollTop;
    const clientH = el.clientHeight;
    const scrollH = el.scrollHeight;

    const can = scrollH > clientH + 1;
    const atTop = scrollTop <= 1;
    const atBottom = scrollTop + clientH >= scrollH - 1;

    const MIN_THUMB_PX = 22;
    let thumbHPercent = 100;
    let thumbTopPercent = 0;

    if (can) {
      // Fórmula típica de scrollbar: tamaño del pulgar proporcional a
      // (área visible)^2 / área total, acotado por un mínimo en px.
      const idealThumbPx = (clientH * clientH) / scrollH;
      const thumbPx = Math.max(idealThumbPx, MIN_THUMB_PX);

      // Posición del pulgar limitada al rango visible.
      const maxTopPx = Math.max(clientH - thumbPx, 0);
      const denom = Math.max(scrollH - clientH, 1);
      const progress = scrollTop / denom;
      const topPx = Math.min(Math.max(progress * maxTopPx, 0), maxTopPx);

      // Conversión a porcentaje respecto a la altura visible.
      thumbHPercent = (thumbPx / clientH) * 100;
      thumbTopPercent = (topPx / clientH) * 100;
    }

    // Actualiza el mapa de estados de forma inmutable para disparar reactividad.
    const next = { ...this.scrollStates() };
    next[id] = { can, atTop, atBottom, thumbH: thumbHPercent, thumbTop: thumbTopPercent };
    this.scrollStates.set(next);
  }

  // Limpieza de observadores al destruir el componente.
  // (El 'effect' y la suscripción con takeUntilDestroyed se limpian automáticamente).
  ngOnDestroy(): void {
    this.roMap.forEach(ro => ro.disconnect());
    this.roMap.clear();
  }
}
