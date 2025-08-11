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
  phone = '34618486352';
  telegramUser = ''; // deja vacío para ocultar el botón
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
  get whatsHref() {
    const txt = `Hola ${this.fullName.split(' ')[0]}, te escribo desde tu portfolio.`;
    return this.phone
      ? `https://wa.me/${this.phone}?text=${encodeURIComponent(txt)}`
      : `https://wa.me/?text=${encodeURIComponent(txt + ' (' + this.email + ')')}`;
  }
  get telegramHref() {
    return this.telegramUser ? `https://t.me/${this.telegramUser}` : '';
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

  downloadVCard() {
    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${this.fullName};;;;`,
      `FN:${this.fullName}`,
      `EMAIL;TYPE=INTERNET,WORK:${this.email}`,
      this.phone ? `TEL;TYPE=CELL:+${this.phone}` : '',
      'NOTE:Contacto generado desde el portfolio',
      'END:VCARD'
    ].filter(Boolean);
    const blob = new Blob([lines.join('\r\n')], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.fullName.replace(/\s+/g, '_')}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  private showToast() {
    this.copied = true;
    setTimeout(() => (this.copied = false), 1600);
  }
}
