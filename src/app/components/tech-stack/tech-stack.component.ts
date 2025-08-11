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

  // Signal con las categorías del stack (inmutable en runtime; fuente: DATA)
  readonly categories = signal<TechCategory[]>(TECH_STACK);

  /** id del item actualmente abierto (formato "catId:index"). null => ninguno abierto */
  openItemId = signal<string | null>(null);

  /** IO para revelar tarjetas al entrar en viewport (animación de aparición) */
  private io?: IntersectionObserver;

  constructor(private renderer: Renderer2, private destroyRef: DestroyRef) { }

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
    const grid = document.querySelector<HTMLElement>('.stack-network');
    if (!grid) return;

    // 2) Reveal básico (clases para keyframes + IO para re-activar al reentrar)
    grid.classList.add('reveal-enabled', 'in-view');
    this.io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && grid.classList.add('in-view')),
      { threshold: 0.15 }
    );
    this.io.observe(grid);

    // Limpieza del IO al destruir (evita leaks)
    this.destroyRef.onDestroy(() => this.io?.disconnect());

    // 3) Respeto a preferencias del usuario sobre animaciones
    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduce) return;

    // 4) Tilt 3D ligero en cada tarjeta (usa variables CSS consumidas en :hover/transform)
    grid.querySelectorAll<HTMLElement>('.stack-node').forEach(card => {

      // Al mover el ratón dentro de la card, calcular offset relativo [-0.5, 0.5] y mapear a grados
      const unlistenMove = this.renderer.listen(card, 'mousemove', (ev: MouseEvent) => {
        const r = card.getBoundingClientRect();
        const x = (ev.clientX - r.left) / r.width - 0.5;
        const y = (ev.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`); // rotación X inversa al eje Y del puntero
        card.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`);  // rotación Y proporcional al eje X del puntero
      });

      // Al salir, limpiar variables para volver al estado neutro
      const unlistenLeave = this.renderer.listen(card, 'mouseleave', () => {
        card.style.removeProperty('--rx');
        card.style.removeProperty('--ry');
      });

      // Limpieza de listeners al destruir (sin implementar OnDestroy explícito)
      this.destroyRef.onDestroy(() => {
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
