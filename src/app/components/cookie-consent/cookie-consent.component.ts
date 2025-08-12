import { Component, HostListener, OnDestroy, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';

/**
 * Estructura del consentimiento almacenado.
 */
type Consent = {
  necessary: true;        // siempre true
  functional: boolean;    // cookies de terceros p.ej. Maps
  analytics: boolean;     // analítica
  policyVersion?: string; // versión del texto legal con el que se otorgó
  ts?: number;            // timestamp guardado (ms)
};

/* ========= Constantes de política / almacenamiento ========= */
const STORAGE_KEY = 'cookieConsent';
const POLICY_VERSION = '2025-08-10';  // súbelo cuando cambie la política
const TTL_DAYS = 180;                 // revalidar consentimiento cada X días

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.css']
})
export class CookieConsentComponent implements OnDestroy {
  /* ======= Estado UI ======= */
  /** Banner “ligero”. Lo mantenemos por si lo necesitas, pero el flujo por defecto usa modal. */
  bannerVisible = false;
  /** Modal de configuración (debe aparecer al iniciar). */
  modalVisible = false;

  /** Estado actual (reactivo manual vía ngModel en el template). */
  consent: Consent = { necessary: true, functional: true, analytics: false };

  /* ======= Internos ======= */
  private readonly isBrowser: boolean;
  private lastFocusedEl: HTMLElement | null = null;          // para devolver el foco tras cerrar el modal
  private boundOnStorage = (e: StorageEvent) => this.onStorage(e); // referencia estable para removeEventListener

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Solo interactuamos con Web APIs en el navegador
    if (this.isBrowser) {
      // 1) Leer consentimiento guardado (si existe) y decidir si pedirlo otra vez
      const saved = this.readStoredConsent();
      const expired = isExpired(saved?.ts, TTL_DAYS);
      const versionMismatch = saved?.policyVersion !== POLICY_VERSION;
      const invalid = saved && !isShapeValid(saved);

      if (!saved || expired || versionMismatch || invalid) {
        // Mostrar MODAL en la primera visita o cuando toque revalidar
        this.modalVisible = true;
        // Estado de partida más restrictivo (si hubiera algo corrupto)
        this.consent = { necessary: true, functional: false, analytics: false };
      } else {
        this.consent = saved;
        this.modalVisible = false; // ya tenemos consentimiento vigente
      }

      // 2) Sincronizar preferencias entre pestañas/ventanas
      window.addEventListener('storage', this.boundOnStorage);

      // 3) Helper de depuración (opcional)
      (window as any).debugConsentReset = () => this.resetAndShow();
    }
  }

  /* ========= Acciones públicas (usadas en el template) ========= */

  /** Acepta todas las categorías y persiste. */
  acceptAll() {
    this.consent = { necessary: true, functional: true, analytics: true };
    this.saveConsent();
  }

  /** Rechaza todas las categorías opcionales y persiste. */
  rejectAll() {
    this.consent = { necessary: true, functional: false, analytics: false };
    this.saveConsent();
  }

  /** Abre el modal de configuración (y gestiona foco). */
  openConfig() {
    this.modalVisible = true;
    this.captureFocus();
  }

  /** Guarda lo marcado en switches. */
  saveConfig() {
    this.saveConsent();
  }

  /** Cierra el modal (sin guardar). */
  closeModal() {
    this.modalVisible = false;
    this.restoreFocus();
  }

  /** Cerrar modal con Escape. */
  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.modalVisible) this.closeModal();
  }

  /** Abrir página de cookies mediante Router. */
  async goToCookies(ev: Event) {
    ev.preventDefault();
    this.modalVisible = false;
    this.bannerVisible = false;
    await this.router.navigate(['/cookies']);
    // “instant” no existe en el tipo, casteamos el literal
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }

  /** API pública: abrir modal desde fuera (p.ej. footer). */
  @HostListener('window:open-cookie-settings')
  onOpenSettings() {
    this.openConfig();
  }

  /* ========= Persistencia y eventos ========= */

  /** Guardar consentimiento + versionado + ts + emitir evento global con detalle. */
  private saveConsent() {
    if (!this.isBrowser) return;

    const toSave: Consent = {
      ...this.consent,
      policyVersion: POLICY_VERSION,
      ts: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));

    this.bannerVisible = false;
    this.modalVisible = false;

    // Notificar a la app (p.ej., montar/desmontar scripts de terceros según consentimiento)
    const evt = new CustomEvent(STORAGE_KEY + '-change', { detail: toSave }); // nombre: "cookieConsent-change"
    window.dispatchEvent(evt);

    this.restoreFocus();
  }

  /** Lee y parsea el consentimiento del almacenamiento (seguro). */
  private readStoredConsent(): Consent | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Consent;
      return parsed ?? null;
    } catch {
      return null;
    }
  }

  /** Sincroniza estado local si otra pestaña lo cambia. */
  private onStorage(e: StorageEvent) {
    if (e.key !== STORAGE_KEY) return;
    const latest = this.readStoredConsent();
    if (latest && isShapeValid(latest)) {
      this.consent = latest;
      // si otra pestaña aceptó/guardó, cerramos modal/banners aquí
      this.modalVisible = false;
      this.bannerVisible = false;
    }
  }

  /* ========= Accesibilidad: foco del modal ========= */

  /** Guarda el foco actual y lo mueve al primer control del modal. */
  private captureFocus() {
    if (!this.isBrowser) return;
    this.lastFocusedEl = document.activeElement as HTMLElement | null;

    // dar un tick para que el DOM del modal exista
    setTimeout(() => {
      const root = document.querySelector('.cookie-modal') as HTMLElement | null;
      if (!root) return;
      const focusable = root.querySelector<HTMLElement>(
        // controles típicos: inputs, buttons, links, switches…
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable?.focus();
    });
  }

  /** Devuelve el foco donde estaba antes de abrir el modal. */
  private restoreFocus() {
    if (!this.isBrowser) return;
    setTimeout(() => this.lastFocusedEl?.focus(), 0);
  }

  /** Trap de TAB dentro del modal (ciclo) para no escapar al resto de la página. */
  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    if (!this.modalVisible || e.key !== 'Tab') return;

    const root = document.querySelector('.cookie-modal') as HTMLElement | null;
    if (!root) return;

    const focusables = Array.from(
      root.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1);

    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (!e.shiftKey && active === last) {
      first.focus();
      e.preventDefault();
    } else if (e.shiftKey && active === first) {
      last.focus();
      e.preventDefault();
    }
  }

  /* ========= Depuración ========= */
  /** Limpia almacenamiento y muestra banner (para test). El flujo real abre MODAL en init. */
  private resetAndShow() {
    if (!this.isBrowser) return;
    localStorage.removeItem(STORAGE_KEY);
    this.bannerVisible = true; // 👈 solo para debug; en producción podrías reabrir modal si prefieres
    this.modalVisible = false;
    const evt = new CustomEvent(STORAGE_KEY + '-change', { detail: null });
    window.dispatchEvent(evt);
  }

  /* ========= Limpieza ========= */
  ngOnDestroy(): void {
    if (this.isBrowser) {
      window.removeEventListener('storage', this.boundOnStorage);
    }
  }
}

/* ================= Helpers puros ================= */

/** Comprueba si ha expirado un consentimiento según TTL (días). */
function isExpired(ts: number | undefined, days: number): boolean {
  if (!ts) return true;
  const ms = days * 24 * 60 * 60 * 1000;
  return Date.now() - ts > ms;
}

/** Valida la forma mínima del objeto de consentimiento. */
function isShapeValid(c: Consent | null | undefined): c is Consent {
  return !!c && c.necessary === true
    && typeof c.functional === 'boolean'
    && typeof c.analytics === 'boolean';
}
