import { Component, AfterViewInit, OnDestroy, signal } from '@angular/core';
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
export class TechStackComponent implements AfterViewInit, OnDestroy {
  readonly categories = signal<TechCategory[]>(TECH_STACK);

  private io?: IntersectionObserver;
  private cleanups: Array<() => void> = [];

  ngAfterViewInit() {
    const grid = document.querySelector<HTMLElement>('.stack-network');
    if (!grid) return;

    // Siempre visible de base + reveal si el observer entra
    grid.classList.add('reveal-enabled', 'in-view');

    this.io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && grid.classList.add('in-view')),
      { threshold: 0.15 }
    );
    this.io.observe(grid);

    // Tilt suave (sin spotlight) — respeta reduce motion
    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduce) {
      grid.querySelectorAll<HTMLElement>('.stack-node').forEach(card => {
        const onMove = (ev: MouseEvent) => {
          const r = card.getBoundingClientRect();
          const x = (ev.clientX - r.left) / r.width - 0.5;
          const y = (ev.clientY - r.top) / r.height - 0.5;
          card.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`);
          card.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`);
        };
        const onLeave = () => {
          card.style.removeProperty('--rx');
          card.style.removeProperty('--ry');
        };
        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', onLeave);
        this.cleanups.push(() => {
          card.removeEventListener('mousemove', onMove);
          card.removeEventListener('mouseleave', onLeave);
        });
      });
    }
  }

  ngOnDestroy() {
    this.io?.disconnect();
    this.cleanups.forEach(fn => fn());
  }

  trackCat = (_: number, c: TechCategory) => c.id;
  trackItem = (_: number, i: TechItem) => i.label;
}
