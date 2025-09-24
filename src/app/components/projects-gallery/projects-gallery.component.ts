// Componente que muestra una galería de proyectos con filtros por categoría,
// apertura/cierre de tarjetas y un scrollbar "custom" cuya posición y tamaño
// se calculan en función del contenido. Ahora además actúa como CARRUSEL paginado.
// Usa Angular Signals y ResizeObserver.

import {
  Component, computed, signal, OnDestroy, AfterViewInit,
  ViewChildren, ViewChild, ElementRef, QueryList, effect, HostListener,
  Injector, inject, DestroyRef, afterNextRender
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project, ProjectCategory } from '../../interfaces/project.interface';
import { PROJECTS } from '../../data/projects.data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Clave de filtro: 'ALL' (todos) o una categoría concreta del proyecto.
type FilterKey = 'ALL' | ProjectCategory;

// Estado de scroll por tarjeta.
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

  // ====== FILTROS ============================================================
  readonly categories: FilterKey[] = ['ALL', 'ANDROID', 'JAVA/BACK', 'ANGULAR', 'PYTHON'];

  active = signal<FilterKey>('ALL');
  projects = signal<Project[]>(PROJECTS);
  openedId = signal<string | null>(null);

  // ====== SCROLLBAR CUSTOM POR TARJETA ======================================
  private scrollStates = signal<Record<string, ScrollState>>({});
  private roMap = new Map<string, ResizeObserver>();

  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostRef = inject(ElementRef) as ElementRef<HTMLElement>;

  // Elementos de la UI
  @ViewChildren('meta') metas!: QueryList<ElementRef<HTMLElement>>;
  // OJO: este #viewport lo añadiremos en el HTML en el siguiente paso.
  // Si aún no existe, el componente usa el ancho del host para no romper.
  @ViewChild('viewport', { static: false }) viewportEl?: ElementRef<HTMLElement>;

  // Lista filtrada
  filtered = computed(() => {
    const key = this.active();
    if (key === 'ALL') return this.projects();
    return this.projects().filter(p => p.categories.includes(key));
  });

  // ====== CARRUSEL: estado/layout ===========================================
  // Layout por página (grid interna). Desktop: 3x2 = 6. En responsive se ajusta.
  cols = signal(3);
  rows = signal(2);
  itemsPerView = signal(6);

  // Página actual (0-based)
  page = signal(0);

  // Ancho del viewport en píxeles para desplazar por páginas de forma exacta
  vpW = signal(0);

  // Particiona la lista filtrada en páginas del tamaño visible.
  pages = computed(() => {
    const data = this.filtered();
    const per = this.itemsPerView();
    const out: Project[][] = [];
    for (let i = 0; i < data.length; i += per) out.push(data.slice(i, i + per));
    // corrige página fuera de rango tras cambios de filtro/tamaño
    const max = Math.max(0, out.length - 1);
    if (this.page() > max) this.page.set(max);
    return out;
  });

  totalPages = computed(() => this.pages().length);

  // Desplazamiento SUAVE en píxeles (evita cortes laterales)
  trackTransform = computed(() => `translate3d(${-this.page() * this.vpW()}px, 0, 0)`);

  // ====== EFECTOS ============================================================
  // Recalcula estados de scrollbar al re-render con nuevo set filtrado.
  readonly _recalc = effect(() => {
    this.filtered();
    afterNextRender(() => this.initStates(), { injector: this.injector });
  }, { injector: this.injector });

  // ====== CICLO DE VIDA ======================================================
  private roLayout?: ResizeObserver;

  ngAfterViewInit(): void {
    // 1) Scrollbars por tarjeta
    this.initStates();

    this.metas.changes
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.initStates());

    // 2) ResizeObserver para layout del carrusel y ancho del viewport
    const target: HTMLElement = this.viewportEl?.nativeElement ?? this.hostRef.nativeElement;

    this.roLayout = new ResizeObserver(entries => {
      const w = Math.floor(entries[0].contentRect.width);
      this.vpW.set(w);

      // Breakpoints simples
      if (w >= 1200) { this.cols.set(3); this.rows.set(2); }     // 3x2 = 6
      else if (w >= 768) { this.cols.set(2); this.rows.set(2); } // 2x2 = 4
      else if (w >= 520) { this.cols.set(2); this.rows.set(1); } // 2x1 = 2
      else { this.cols.set(1); this.rows.set(1); }               // 1x1 = 1

      this.itemsPerView.set(Math.min(6, this.cols() * this.rows()));

      // expone columnas a CSS (usado por .projects-page)
      this.hostRef.nativeElement.style.setProperty('--cols', String(this.cols()));

      // corrige página si ha quedado fuera de rango
      const max = Math.max(0, this.totalPages() - 1);
      if (this.page() > max) this.page.set(max);
    });

    this.roLayout.observe(target);
  }

  // Limpieza
  ngOnDestroy(): void {
    this.roMap.forEach(ro => ro.disconnect());
    this.roMap.clear();
    this.roLayout?.disconnect();
  }

  // ====== EVENTOS GLOBAL/RESPONSIVE =========================================
  // Conservamos tu resize para forzar recálculo de scrollbars
  @HostListener('window:resize')
  onResize() { this.initStates(); }

  // Accesibilidad: navegación con teclado para el carrusel
  @HostListener('window:keydown', ['$event'])
  onWindowKey(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') this.prevPage();
    if (e.key === 'ArrowRight') this.nextPage();
  }

  // ====== MÉTODOS CARRUSEL ===================================================
  prevPage() { if (this.page() > 0) this.page.update(p => p - 1); }
  nextPage() { if ((this.page() + 1) < this.totalPages()) this.page.update(p => p + 1); }
  goToPage(i: number) { if (i >= 0 && i < this.totalPages()) this.page.set(i); }

  // Swipe táctil (Pointer Events)
  private startX = 0; private dragging = false;
  onPointerDown(e: PointerEvent) { this.startX = e.clientX; this.dragging = true; }
  onPointerMove(e: PointerEvent) {
    if (!this.dragging) return;
    const dx = e.clientX - this.startX;
    if (dx > 60) { this.prevPage(); this.dragging = false; }
    else if (dx < -60) { this.nextPage(); this.dragging = false; }
  }
  onPointerUp() { this.dragging = false; }

  // ====== UI: filtros / tarjetas / acciones internas ========================
  setFilter(key: FilterKey) { this.active.set(key); this.openedId.set(null); this.page.set(0); }

  trackById = (_: number, p: Project) => p.id;

  toggleCard(id: string, ev?: Event) {
    if (ev) {
      const target = ev.target as HTMLElement;
      if (target.closest('button,a')) return; // ignora clicks en CTAs internos
    }
    const current = this.openedId();
    this.openedId.set(current === id ? null : id);
  }

  onKeydown(ev: KeyboardEvent, id: string) {
    if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); this.toggleCard(id); }
    else if (ev.key === 'Escape' && this.openedId() === id) { this.openedId.set(null); }
  }

  isOpen(id: string) { return this.openedId() === id; }

  openProject(ev: MouseEvent, url?: string | null) {
    ev.stopPropagation();
    if (url) window.open(url, '_blank', 'noopener');
  }

  openVideo(ev: MouseEvent, videoUrl?: string | null) {
    ev.stopPropagation();
    if (videoUrl) window.open(videoUrl, '_blank', 'noopener');
  }

  // ====== SCROLLBAR custom: helpers =========================================
  state(id: string): ScrollState {
    return this.scrollStates()[id] ?? { can: false, atTop: true, atBottom: true, thumbH: 100, thumbTop: 0 };
    //                                  ^ valores por defecto si aún no hay estado calculado
  }

  ensureState(el: HTMLElement, id: string) { this.attachAndUpdate(id, el); }
  onScroll(el: HTMLElement, id: string) { this.updateScrollState(id, el); }

  private initStates() {
    this.metas?.forEach(ref => {
      const el = ref.nativeElement;
      const id = el.dataset['id'] || '';
      if (id) this.attachAndUpdate(id, el);
    });
  }

  private attachAndUpdate(id: string, el: HTMLElement) {
    this.updateScrollState(id, el);
    if (!this.roMap.has(id)) {
      const ro = new ResizeObserver(() => this.updateScrollState(id, el));
      ro.observe(el);
      this.roMap.set(id, ro);
    }
  }

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
      const idealThumbPx = (clientH * clientH) / scrollH;
      const thumbPx = Math.max(idealThumbPx, MIN_THUMB_PX);

      const maxTopPx = Math.max(clientH - thumbPx, 0);
      const denom = Math.max(scrollH - clientH, 1);
      const progress = scrollTop / denom;
      const topPx = Math.min(Math.max(progress * maxTopPx, 0), maxTopPx);

      thumbHPercent = (thumbPx / clientH) * 100;
      thumbTopPercent = (topPx / clientH) * 100;
    }

    const next = { ...this.scrollStates() };
    next[id] = { can, atTop, atBottom, thumbH: thumbHPercent, thumbTop: thumbTopPercent };
    this.scrollStates.set(next);
  }
}
