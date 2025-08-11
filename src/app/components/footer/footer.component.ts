import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';

/* ================= Constantes compartidas ================= */
type Consent = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  policyVersion?: string;
  ts?: number;
};

const STORAGE_KEY = 'cookieConsent';
const DEFAULT_CONSENT: Consent = { necessary: true, functional: false, analytics: false };

/* Evento nuevo que emite cookie-consent mejorado */
const EVENT_CHANGE = 'cookieConsent-change';
/* Evento legacy (con guion) para compatibilidad hacia atrás */
const EVENT_CHANGE_LEGACY = 'cookie-consent-change';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {
  /** © Año actual en el pie */
  currentYear = new Date().getFullYear();

  /**
   * Estado local del consentimiento:
   * - Se usa en la plantilla para decidir si renderizar el mapa (consent.functional).
   */
  consent: Consent = DEFAULT_CONSENT;

  /** SSR guard: solo tocar window/localStorage si estamos en navegador */
  private readonly isBrowser: boolean;

  /** Referencias enlazadas para poder remover listeners en OnDestroy */
  private readonly onConsentChangeBound = (e: Event) => this.onConsentChange(e);
  private readonly onConsentChangeLegacyBound = (e: Event) => this.onConsentChange(e);
  private readonly onStorageBound = (e: StorageEvent) => this.onStorage(e);

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.consent = this.readConsentSafe();
    }
  }

  /**
   * Registramos listeners cuando el componente está listo.
   * - EVENT_CHANGE: nuevo nombre emitido por cookie-consent mejorado (CustomEvent con detail).
   * - EVENT_CHANGE_LEGACY: compatibilidad con versiones anteriores.
   * - storage: sincroniza cambios entre pestañas/ventanas.
   */
  ngOnInit(): void {
    if (!this.isBrowser) return;

    window.addEventListener(EVENT_CHANGE, this.onConsentChangeBound as EventListener);
    window.addEventListener(EVENT_CHANGE_LEGACY, this.onConsentChangeLegacyBound as EventListener);
    window.addEventListener('storage', this.onStorageBound);
  }

  /** Limpieza de listeners para evitar fugas. */
  ngOnDestroy(): void {
    if (!this.isBrowser) return;

    window.removeEventListener(EVENT_CHANGE, this.onConsentChangeBound as EventListener);
    window.removeEventListener(EVENT_CHANGE_LEGACY, this.onConsentChangeLegacyBound as EventListener);
    window.removeEventListener('storage', this.onStorageBound);
  }

  /**
   * Lee y parsea el consentimiento del almacenamiento de forma segura.
   * - Devuelve siempre un objeto con la forma esperada (fallback a DEFAULT_CONSENT).
   */
  private readConsentSafe(): Consent {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_CONSENT;
      const parsed = JSON.parse(raw) as Partial<Consent> | null;

      // Normaliza y asegura la forma mínima
      if (!parsed || parsed.necessary !== true) return DEFAULT_CONSENT;
      return {
        necessary: true,
        functional: !!parsed.functional,
        analytics: !!parsed.analytics,
        policyVersion: parsed.policyVersion,
        ts: parsed.ts
      };
    } catch {
      return DEFAULT_CONSENT;
    }
  }

  /** Maneja el evento global de cambio de consentimiento. */
  private onConsentChange(e: Event) {
    // Si viene como CustomEvent con detail, úsalo; si no, relee de storage.
    const ce = e as CustomEvent<Consent | null | undefined>;
    if (ce && 'detail' in ce && ce.detail && ce.detail.necessary === true) {
      this.consent = {
        necessary: true,
        functional: !!ce.detail.functional,
        analytics: !!ce.detail.analytics,
        policyVersion: ce.detail.policyVersion,
        ts: ce.detail.ts
      };
    } else {
      this.consent = this.readConsentSafe();
    }
  }

  /** Sincroniza cambios realizados en otras pestañas/ventanas. */
  private onStorage(e: StorageEvent) {
    if (e.key !== STORAGE_KEY) return;
    this.consent = this.readConsentSafe();
  }

  /** ✅ Abre el modal de configuración (dispara evento global que escucha cookie-consent). */
  openCookieSettings(ev?: Event) {
    ev?.preventDefault();
    window.dispatchEvent(new Event('open-cookie-settings'));
  }
}
