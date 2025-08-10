import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  // ==== Configura aquí tus datos =====
  readonly subject = 'Contacto desde el portfolio';
  readonly body = 'Hola Sergio,%0D%0A%0D%0AHe visto tu portfolio y me gustaría hablar contigo.';
  readonly phone = ''; // ← si tienes WhatsApp en número internacional, ej: '34600111222'
  readonly telegramUser = ''; // ej: 'sergio_username' (sin @). Deja vacío para ocultar.
  // ===================================

  email = 'sergio@email.com';

  copied = false;

  get mailtoHref() {
    return `mailto:${this.email}?subject=${encodeURIComponent(this.subject)}&body=${this.body}`;
  }

  get gmailHref() {
    // Gmail compose
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(this.email)}&su=${encodeURIComponent(this.subject)}&body=${this.body}`;
  }

  get outlookHref() {
    // Outlook web compose
    return `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(this.email)}&subject=${encodeURIComponent(this.subject)}&body=${this.body}`;
  }

  get whatsHref() {
    // Si no hay teléfono, usa “send” con texto y mail
    const txt = `Hola Sergio, te escribo desde tu portfolio. Mi correo es ...`;
    const base = this.phone
      ? `https://wa.me/${this.phone}?text=${encodeURIComponent(txt)}`
      : `https://wa.me/?text=${encodeURIComponent(txt + ' (' + this.email + ')')}`;
    return base;
  }

  async copyEmail() {
    try {
      await navigator.clipboard.writeText(this.email);
      this.showToast();
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = this.email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      this.showToast();
    }
  }

  private showToast() {
    this.copied = true;
    setTimeout(() => (this.copied = false), 1600);
  }
}

