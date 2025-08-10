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
  readonly categories: FilterKey[] = ['ALL', 'ANDROID', 'JAVA/BACK', 'ANGULAR', 'PYTHON'];

  active = signal<FilterKey>('ALL');
  projects = signal<Project[]>(PROJECTS);

  openedId = signal<string | null>(null);
  private scrollStates = signal<Record<string, ScrollState>>({});
  private roMap = new Map<string, ResizeObserver>();

  filtered = computed(() => {
    const key = this.active();
    if (key === 'ALL') return this.projects();
    return this.projects().filter(p => p.categories.includes(key));
  });

  setFilter(key: FilterKey) {
    this.active.set(key);
    this.openedId.set(null);
  }

  trackById = (_: number, p: Project) => p.id;

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

  onKeydown(ev: KeyboardEvent, id: string) {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      this.toggleCard(id);
    } else if (ev.key === 'Escape' && this.openedId() === id) {
      this.openedId.set(null);
    }
  }

  isOpen(id: string) {
    return this.openedId() === id;
  }

  openProject(ev: MouseEvent, url?: string | null) {
    ev.stopPropagation();
    if (!url) return;
    window.open(url, '_blank', 'noopener');
  }

  state(id: string): ScrollState {
    return this.scrollStates()[id] ?? { can: false, atTop: true, atBottom: true, thumbH: 100, thumbTop: 0 };
  }

  ensureState(el: HTMLElement, id: string) {
    this.attachAndUpdate(id, el);
  }

  onScroll(el: HTMLElement, id: string) {
    this.updateScrollState(id, el);
  }

  /** Vincula un ResizeObserver y recalcula estado */
  private attachAndUpdate(id: string, el: HTMLElement) {
    this.updateScrollState(id, el);

    if (!this.roMap.has(id)) {
      const ro = new ResizeObserver(() => this.updateScrollState(id, el));
      ro.observe(el);
      this.roMap.set(id, ro);
    }
  }

  /** Cálculo exacto del thumb incluso con tamaño mínimo en PX */
  private updateScrollState(id: string, el: HTMLElement) {
    const scrollTop = el.scrollTop;
    const clientH = el.clientHeight;
    const scrollH = el.scrollHeight;

    const can = scrollH > clientH + 1;
    const atTop = scrollTop <= 1;
    const atBottom = scrollTop + clientH >= scrollH - 1;

    // Tamaño mínimo del thumb en PX (para que siempre sea visible)
    const MIN_THUMB_PX = 22;

    let thumbHPercent = 100;
    let thumbTopPercent = 0;

    if (can) {
      // Altura teórica en px y clamp a mínimo
      const idealThumbPx = (clientH * clientH) / scrollH; // clientH * (clientH/scrollH)
      const thumbPx = Math.max(idealThumbPx, MIN_THUMB_PX);

      // Posición en px proporcional al progreso real
      const maxTopPx = Math.max(clientH - thumbPx, 0);
      const denom = Math.max(scrollH - clientH, 1);
      const progress = scrollTop / denom; // 0..1
      const topPx = Math.min(Math.max(progress * maxTopPx, 0), maxTopPx);

      // Convertimos a %
      thumbHPercent = (thumbPx / clientH) * 100;
      thumbTopPercent = (topPx / clientH) * 100;
    }

    const next = { ...this.scrollStates() };
    next[id] = { can, atTop, atBottom, thumbH: thumbHPercent, thumbTop: thumbTopPercent };
    this.scrollStates.set(next);
  }

  ngOnDestroy(): void {
    // Limpieza de observers
    this.roMap.forEach(ro => ro.disconnect());
    this.roMap.clear();
  }
}
