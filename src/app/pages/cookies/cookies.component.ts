import { Component } from '@angular/core';

@Component({
  selector: 'app-cookies',
  standalone: true,
  templateUrl: './cookies.component.html',
  styleUrl: './cookies.component.css'
})
export class CookiesComponent {
  // Para mostrar fecha de última actualización (ajústala si cambias la política)
  lastUpdated = 'Agosto 2025';

  openSettings() {
    window.dispatchEvent(new Event('open-cookie-settings'));
  }

  resetConsent() {
    localStorage.removeItem('cookieConsent');
    window.dispatchEvent(new Event('cookie-consent-change'));
    window.dispatchEvent(new Event('open-cookie-settings'));
  }
}
