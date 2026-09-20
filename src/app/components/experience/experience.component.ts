import { AfterViewInit, Component, ElementRef, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EXPERIENCE } from '../../data/experience.data';
import { Experience } from '../../interfaces/experience.interface';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css',
  host: { id: 'experience' } // Permite enlazar con [fragment]="#experience" desde el navbar
})
export class ExperienceComponent implements AfterViewInit, OnDestroy {
  /**
   * 📦 Fuente reactiva de elementos del timeline.
   * - signal<Experience[]>: expone los datos a la plantilla de forma eficiente.
   * - Se inicializa desde un dataset estático (EXPERIENCE).
   */
  readonly items = signal<Experience[]>(EXPERIENCE);

  /** IntersectionObserver para disparar la animación "reveal" al entrar en viewport. */
  private io?: IntersectionObserver;

  constructor(private readonly hostRef: ElementRef<HTMLElement>) { }

  /** Datos base para componer enlaces de contacto (mailto / Gmail / Outlook Web). */
  email = 'sergio@email.com';
  subject = 'Contacto desde portfolio';
  body = 'Hola Sergio, ';

  /** Revela cada tarjeta al entrar en viewport y deja de observarla después. */
  ngAfterViewInit(): void {
    const timeline = this.hostRef.nativeElement.querySelector<HTMLElement>('.xp-timeline');
    const cards = Array.from(this.hostRef.nativeElement.querySelectorAll<HTMLElement>('.xp-card'));
    if (!timeline || cards.length === 0) return;

    timeline.classList.add('reveal-ready');
    cards.forEach((card, index) => {
      card.style.setProperty('--reveal-delay', `${Math.min(index, 5) * 55}ms`);
    });

    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cards.forEach(card => card.classList.add('in-view'));
      return;
    }

    this.io = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const card = entry.target as HTMLElement;
        card.addEventListener('transitionend', () => card.style.setProperty('--reveal-delay', '0ms'), { once: true });
        card.classList.add('in-view');
        this.io?.unobserve(entry.target);
      }),
      { threshold: 0.01, rootMargin: '0px 0px -32px 0px' }
    );

    cards.forEach(card => this.io?.observe(card));
  }

  /** Limpia el observer para evitar fugas de memoria cuando el componente se destruye. */
  ngOnDestroy(): void {
    this.io?.disconnect();
  }

  /**
   * mailto: enlace al cliente de correo por defecto del sistema.
   * - encodeURIComponent evita problemas con espacios y caracteres especiales.
   */
  get mailtoHref() {
    return `mailto:${this.email}?subject=${encodeURIComponent(this.subject)}&body=${encodeURIComponent(this.body)}`;
  }

  /**
   * Gmail Web (compose) con parámetros pre-rellenados.
   * - Se abre en nueva pestaña/ventana (target=_blank en el template).
   */
  get gmailHref() {
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(this.email)}&su=${encodeURIComponent(this.subject)}&body=${encodeURIComponent(this.body)}`;
  }

  /**
   * Outlook Web (compose) con parámetros pre-rellenados.
   */
  get outlookHref() {
    return `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(this.email)}&subject=${encodeURIComponent(this.subject)}&body=${encodeURIComponent(this.body)}`;
  }

  /**
   * Acción "Contáctame":
   * - Intenta abrir el cliente nativo de correo mediante mailto.
   * - Si el sistema no tiene cliente configurado, el usuario no verá nada;
   *   por eso se ofrecen en la UI las alternativas web (Gmail/Outlook) y copiar email.
   *
   * Nota: asignar window.location.href normalmente no lanza excepciones;
   * el try/catch es defensivo y evita ruidos en consola.
   */
  contactMe() {
    try {
      window.location.href = this.mailtoHref; // intenta abrir la app de correo
      // Si el SO no tiene cliente, el usuario no verá nada: por eso dejamos las opciones web visibles debajo.
    } catch {
      // Silenciar: el usuario puede usar alternativas web o copiar el email
    }
  }

  /**
   * Copia el email al portapapeles usando la Clipboard API.
   * - Requiere contexto seguro (HTTPS) y permiso del usuario.
   * - Muestra un alert como feedback simple; en UI final suele sustituirse por un toast.
   */
  copyEmail(email: string) {
    navigator.clipboard.writeText(email)
      .then(() => alert('El email de Sergio se ha copiado al portapapeles.'))
      .catch(() => console.warn('No se pudo copiar el email'));
  }



  /**
   * trackBy para *ngFor del timeline:
   * - Evita recrear nodos DOM al actualizar listas, mejora rendimiento.
   */
  trackById = (_: number, it: Experience) => it.id;
}
