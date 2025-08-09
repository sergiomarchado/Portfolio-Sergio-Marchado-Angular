import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project, ProjectCategory } from '../../interfaces/project.interface';
import { PROJECTS } from '../../data/projects.data';

type FilterKey = 'ALL' | ProjectCategory;

@Component({
  selector: 'app-projects-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects-gallery.component.html',
  styleUrl: './projects-gallery.component.css'
})
export class ProjectsGalleryComponent {
  readonly categories: FilterKey[] = ['ALL', 'ANDROID', 'JAVA/BACK', 'ANGULAR', 'PYTHON'];

  active = signal<FilterKey>('ALL');
  projects = signal<Project[]>(PROJECTS);

  /** id de la card abierta (para móvil/teclado). null = ninguna */
  openedId = signal<string | null>(null);

  filtered = computed(() => {
    const key = this.active();
    if (key === 'ALL') return this.projects();
    return this.projects().filter(p => p.categories.includes(key));
  });

  setFilter(key: FilterKey) {
    this.active.set(key);
    this.openedId.set(null); // cierra overlay al cambiar filtro
  }

  trackById = (_: number, p: Project) => p.id;

  /** Alterna apertura de una card (tap/click) */
  toggleCard(id: string, ev?: Event) {
    // si el click viene de un elemento interactivo interno, no togglear
    if (ev) {
      const target = ev.target as HTMLElement;
      if (target.closest('button,a')) return;
    }
    const current = this.openedId();
    this.openedId.set(current === id ? null : id);
  }

  /** Teclado: Enter y Space */
  onKeydown(ev: KeyboardEvent, id: string) {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault(); // evita scroll con Space
      this.toggleCard(id);
    } else if (ev.key === 'Escape' && this.openedId() === id) {
      this.openedId.set(null);
    }
  }

  isOpen(id: string) {
    return this.openedId() === id;
  }

  /** ÚNICO punto que abre la URL del proyecto */
  openProject(ev: MouseEvent, url?: string | null) {
    ev.stopPropagation(); // no cerrar/abrir la card al pulsar el botón
    if (!url) return;
    window.open(url, '_blank', 'noopener');
  }
}
