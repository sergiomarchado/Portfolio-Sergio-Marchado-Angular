import { Component, AfterViewInit, signal, Renderer2, DestroyRef, ElementRef } from '@angular/core';
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

  // Signal con las categorías del stack (inmutable en runtime; fuente: DATA)
  readonly categories = signal<TechCategory[]>(TECH_STACK);

  /** id del item actualmente abierto (formato "catId:index"). null => ninguno abierto */
  openItemId = signal<string | null>(null);

  /** IO para revelar tarjetas al entrar en viewport (animación de aparición) */
  private io?: IntersectionObserver;

  constructor(
    private renderer: Renderer2,
    private destroyRef: DestroyRef,
    private readonly hostRef: ElementRef<HTMLElement>
  ) { }

  // ---------- Helpers de apertura ----------
  /** Construye un id estable para cada item (cat + índice) */
  itemId(catId: string, index: number) {
    return `${catId}:${index}`;
  }
  /** ¿Este id coincide con el abierto actualmente? */
  isOpen(id: string) {
    return this.openItemId() === id;
  }


  /**
   * Alterna apertura/cierre de un item.
   * Paso a paso:
   *  1) Si el click proviene de <a> o <button> dentro del item, NO togglear (deja navegar).
   *  2) Si el id ya está abierto => cerrar (set null). Si no => abrir (set id).
   */
  toggleItem(id: string, ev?: Event) {
    if (ev) {
      const t = ev.target as HTMLElement;
      if (t.closest('a,button')) return;
    }
    this.openItemId.set(this.openItemId() === id ? null : id);
  }

  /**
   *  Accesibilidad por teclado en cada item:
   * - Enter/Espacio => toggle
   * - Escape => cerrar si está abierto
   */
  onKeydown(ev: KeyboardEvent, id: string) {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      this.toggleItem(id);
    } else if (ev.key === 'Escape' && this.isOpen(id)) {
      this.openItemId.set(null);
    }
  }
  // ----------------------------------------

  /**
   * ngAfterViewInit:
   * Inicializa efectos visuales y listeners una vez que el DOM está disponible.
   * Paso a paso:
   *  1) Buscar la grid raíz (.stack-network). Si no existe, salir.
   *  2) REVEAL: añadir clases y observar con IntersectionObserver para activar animación al entrar en viewport.
   *     • Limpieza: desconectar IO al destruir el componente (DestroyRef).
   *  3) PREFERS REDUCED MOTION: si el usuario prefiere menos animaciones, NO activar tilt.
   *  4) TILT: para cada .stack-node, escuchar mousemove/mouseleave y ajustar variables CSS --rx/--ry.
   *     • Limpieza: desuscribir listeners al destruir (DestroyRef).
   */
  ngAfterViewInit() {
    const grid = this.hostRef.nativeElement.querySelector<HTMLElement>('.stack-network');
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>('.stack-node'));

    grid.classList.add('reveal-enabled');
    cards.forEach((card, index) => {
      card.style.setProperty('--reveal-delay', `${Math.min(index, 5) * 55}ms`);
    });

    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduce || !('IntersectionObserver' in window)) {
      grid.classList.add('in-view');
      cards.forEach(card => card.classList.add('in-view'));
      return;
    }

    this.io = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        grid.classList.add('in-view');
        const card = entry.target as HTMLElement;
        card.addEventListener('transitionend', () => card.style.setProperty('--reveal-delay', '0ms'), { once: true });
        card.classList.add('in-view');
        this.io?.unobserve(entry.target);
      }),
      { threshold: 0.01, rootMargin: '0px 0px -32px 0px' }
    );
    cards.forEach(card => this.io?.observe(card));
    this.destroyRef.onDestroy(() => this.io?.disconnect());

    // El tilt se limita a un cálculo por frame para mantenerlo fluido.
    cards.forEach(card => {
      let frameId: number | null = null;
      let latestEvent: MouseEvent | null = null;

      const unlistenMove = this.renderer.listen(card, 'mousemove', (ev: MouseEvent) => {
        latestEvent = ev;
        if (frameId !== null) return;
        frameId = requestAnimationFrame(() => {
          if (!latestEvent) return;
          const rect = card.getBoundingClientRect();
          const x = (latestEvent.clientX - rect.left) / rect.width - 0.5;
          const y = (latestEvent.clientY - rect.top) / rect.height - 0.5;
          card.style.setProperty('--rx', `${(-y * 3).toFixed(2)}deg`);
          card.style.setProperty('--ry', `${(x * 4).toFixed(2)}deg`);
          frameId = null;
        });
      });

      const unlistenLeave = this.renderer.listen(card, 'mouseleave', () => {
        if (frameId !== null) cancelAnimationFrame(frameId);
        frameId = null;
        latestEvent = null;
        card.style.removeProperty('--rx');
        card.style.removeProperty('--ry');
      });

      this.destroyRef.onDestroy(() => {
        if (frameId !== null) cancelAnimationFrame(frameId);
        unlistenMove();
        unlistenLeave();
      });
    });
  }

  /** trackBy para categorías: evita recrear DOM si no cambia la identidad */
  trackCat = (_: number, c: TechCategory) => c.id;
  /** trackBy para items: usa la etiqueta como key (supone labels únicos en su categoría) */
  trackItem = (_: number, i: TechItem) => i.label;
}
