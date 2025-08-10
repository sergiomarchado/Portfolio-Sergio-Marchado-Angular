import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

type Consent = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  policyVersion?: string;   // 👈 nuevo
  ts?: number;              // 👈 cuándo se guardó (ms)
};

const POLICY_VERSION = '2025-08-10'; // 🗓️ súbelo cuando cambies la política
const TTL_DAYS = 180;                // ⏳ caducidad del consentimiento

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.css']
})
export class CookieConsentComponent {
  bannerVisible = false;
  modalVisible = false;

  consent: Consent = {
    necessary: true,
    functional: false,
    analytics: false
  };

  constructor(private router: Router) {
    const savedStr = localStorage.getItem('cookieConsent');

    if (savedStr) {
      try {
        const saved = JSON.parse(savedStr) as Consent;
        const expired = isExpired(saved.ts, TTL_DAYS);
        const versionMismatch = saved.policyVersion !== POLICY_VERSION;

        if (expired || versionMismatch || !isShapeValid(saved)) {
          this.modalVisible = true; // pedir de nuevo
        } else {
          this.consent = saved;
        }
      } catch {
        this.modalVisible = true; // JSON corrupto → volver a pedir
      }
    } else {
      this.modalVisible = true; // primera visita
    }

    // 🔧 helper de depuración opcional (borra y muestra banner)
    (window as any).debugConsentReset = () => this.resetAndShow();
  }

  acceptAll() {
    this.consent = { necessary: true, functional: true, analytics: true };
    this.saveConsent();
  }

  rejectAll() {
    this.consent = { necessary: true, functional: false, analytics: false };
    this.saveConsent();
  }

  openConfig() { this.modalVisible = true; }

  saveConfig() { this.saveConsent(); }

  private saveConsent() {
    const toSave: Consent = {
      ...this.consent,
      policyVersion: POLICY_VERSION,
      ts: Date.now()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(toSave));
    this.bannerVisible = false;
    this.modalVisible = false;
    window.dispatchEvent(new Event('cookie-consent-change'));
  }

  // ✅ abrir modal desde fuera
  @HostListener('window:open-cookie-settings')
  onOpenSettings() { this.modalVisible = true; }

  closeModal() { this.modalVisible = false; }

  @HostListener('document:keydown.escape')
  onEsc() { if (this.modalVisible) this.closeModal(); }

  async goToCookies(ev: Event) {
    ev.preventDefault();
    this.modalVisible = false;
    this.bannerVisible = false;
    await this.router.navigate(['/cookies']);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }

  // Utilidad de depuración
  private resetAndShow() {
    localStorage.removeItem('cookieConsent');
    this.bannerVisible = true;
    this.modalVisible = false;
    window.dispatchEvent(new Event('cookie-consent-change'));
  }
}

/* --- helpers --- */
function isExpired(ts: number | undefined, days: number): boolean {
  if (!ts) return true;
  const ms = days * 24 * 60 * 60 * 1000;
  return Date.now() - ts > ms;
}
function isShapeValid(c: Consent): boolean {
  return c && typeof c.functional === 'boolean' && typeof c.analytics === 'boolean' && c.necessary === true;
}
