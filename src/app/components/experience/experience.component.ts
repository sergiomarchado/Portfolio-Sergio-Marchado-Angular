import { AfterViewInit, Component, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EXPERIENCE } from '../../data/experience.data';
import { Experience } from '../../interfaces/experience.interface';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css'
})
export class ExperienceComponent implements AfterViewInit, OnDestroy {
  readonly items = signal<Experience[]>(EXPERIENCE);

  private io?: IntersectionObserver;

  email = 'sergio@email.com';
  subject = 'Contacto desde portfolio';
  body = 'Hola Sergio, ';

  ngAfterViewInit(): void {
    const el = document.querySelector<HTMLElement>('.xp-timeline');
    if (!el) return;
    el.classList.add('reveal-ready');
    this.io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && el.classList.add('in-view')),
      { threshold: 0.2 }
    );
    this.io.observe(el);
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }

  get mailtoHref() {
    return `mailto:${this.email}?subject=${encodeURIComponent(this.subject)}&body=${encodeURIComponent(this.body)}`;
  }
  get gmailHref() {
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(this.email)}&su=${encodeURIComponent(this.subject)}&body=${encodeURIComponent(this.body)}`;
  }
  get outlookHref() {
    return `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(this.email)}&subject=${encodeURIComponent(this.subject)}&body=${encodeURIComponent(this.body)}`;
  }

  contactMe() {
    try {
      window.location.href = this.mailtoHref; // intenta abrir la app de correo
      // Si el SO no tiene cliente, el usuario no verá nada: por eso dejamos las opciones web visibles debajo.
    } catch {
      // Silencio: el usuario puede usar Gmail/Outlook o copiar el email
    }
  }

  copyEmail(email: string) {
    navigator.clipboard.writeText(email)
      .then(() => alert('📋 Email copiado'))
      .catch(() => console.warn('No se pudo copiar el email'));
  }



  trackById = (_: number, it: Experience) => it.id;
}
