import { Component, AfterViewInit, signal, Renderer2, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechCategory, TechItem } from '../../interfaces/tech-stack.interface';
import { TECH_STACK } from '../../data/tech-stack.data';

@Component({
  selector: 'app-tech-stack',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tech-stack.component.html',
  styleUrl: './tech-stack.component.css'
})
export class TechStackComponent implements AfterViewInit {
  readonly categories = signal<TechCategory[]>(TECH_STACK);

  /** id del item abierto (catId:index). null = ninguno */
  openItemId = signal<string | null>(null);

  private io?: IntersectionObserver;

  constructor(private renderer: Renderer2, private destroyRef: DestroyRef) { }

  // ---------- Helpers de apertura ----------
  itemId(catId: string, index: number) {
    return `${catId}:${index}`;
  }

  isOpen(id: string) {
    return this.openItemId() === id;
  }

  toggleItem(id: string, ev?: Event) {
    if (ev) {
      const t = ev.target as HTMLElement;
      if (t.closest('a,button')) return;
    }
    this.openItemId.set(this.openItemId() === id ? null : id);
  }

  onKeydown(ev: KeyboardEvent, id: string) {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      this.toggleItem(id);
    } else if (ev.key === 'Escape' && this.isOpen(id)) {
      this.openItemId.set(null);
    }
  }
  // ----------------------------------------

  ngAfterViewInit() {
    const grid = document.querySelector<HTMLElement>('.stack-network');
    if (!grid) return;

    // Reveal
    grid.classList.add('reveal-enabled', 'in-view');
    this.io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && grid.classList.add('in-view')),
      { threshold: 0.15 }
    );
    this.io.observe(grid);

    // Limpieza del IO al destruir
    this.destroyRef.onDestroy(() => this.io?.disconnect());

    // Tilt (solo si no hay reduce motion)
    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduce) return;

    grid.querySelectorAll<HTMLElement>('.stack-node').forEach(card => {
      const unlistenMove = this.renderer.listen(card, 'mousemove', (ev: MouseEvent) => {
        const r = card.getBoundingClientRect();
        const x = (ev.clientX - r.left) / r.width - 0.5;
        const y = (ev.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`);
        card.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`);
      });

      const unlistenLeave = this.renderer.listen(card, 'mouseleave', () => {
        card.style.removeProperty('--rx');
        card.style.removeProperty('--ry');
      });

      // Limpieza de listeners al destruir (sin arrays ni OnDestroy)
      this.destroyRef.onDestroy(() => {
        unlistenMove();
        unlistenLeave();
      });
    });
  }

  trackCat = (_: number, c: TechCategory) => c.id;
  trackItem = (_: number, i: TechItem) => i.label;
}
