import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnDestroy {
  currentYear = new Date().getFullYear();
  consent = this.readConsent();

  private onConsentChange = () => this.consent = this.readConsent();

  constructor() {
    // escucha cambios desde cookie-consent
    window.addEventListener('cookie-consent-change', this.onConsentChange);
  }

  ngOnDestroy(): void {
    window.removeEventListener('cookie-consent-change', this.onConsentChange);
  }

  private readConsent() {
    const saved = localStorage.getItem('cookieConsent');
    return saved ? JSON.parse(saved) : { necessary: true, functional: false, analytics: false };
  }

  // ✅ Abre el modal de configuración (dispara evento global que escucha cookie-consent)
  openCookieSettings(ev?: Event) {
    ev?.preventDefault();
    window.dispatchEvent(new Event('open-cookie-settings'));
  }
}
