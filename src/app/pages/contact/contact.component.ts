import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorldClocksComponent } from '../../components/world-clocks/world-clocks.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, WorldClocksComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  fullName = 'Sergio Marchado';
  email = 'sergio.marchadoropero3@gmail.com';
  subject = 'Contacto desde el portfolio';
  body = 'Hola Sergio,%0D%0A%0D%0AHe visto tu portfolio y me gustaría hablar contigo.';
  availability = 'Inmediata';
  responseTime = '<24h';
  officeHours = '08:00–21:00';
  timezoneLabel = 'CET (Madrid)';

  copied = false;

  get mailtoHref() {
    return `mailto:${this.email}?subject=${encodeURIComponent(this.subject)}&body=${this.body}`;
  }
  get gmailHref() {
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(this.email)}&su=${encodeURIComponent(this.subject)}&body=${this.body}`;
  }
  get outlookHref() {
    return `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(this.email)}&subject=${encodeURIComponent(this.subject)}&body=${this.body}`;
  }

  async copyEmail() {
    try {
      await navigator.clipboard.writeText(this.email);
      this.showToast();
    } catch {
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
