import {
  Component, HostListener, ElementRef, OnInit, AfterViewInit, DestroyRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd, UrlTree } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FooterComponent } from './components/footer/footer.component';
import { CookieConsentComponent } from './components/cookie-consent/cookie-consent.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent, CookieConsentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

// CLASE PRINCIPAL DE LA APLICACIÓN
// Maneja el estado del navbar, el menú y la experiencia en Home.
export class AppComponent implements OnInit, AfterViewInit {

  // Estado de UI compartido por la plantilla:
  scrolled = false;
  menuOpen = false;
  experienceActive = false; // marca el enlace "Experiencia laboral" como activo cuando estamos en /#experience.

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private destroyRef: DestroyRef
  ) { }



  ngOnInit(): void {
    this.onScroll();   // Inicializa 'scrolled' con la posición actual (por si ya hay desplazamiento).
    this.updateActiveByFragment(); // Asegura estado correcto al primer render.
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.updateActiveByFragment());
  }


  /**
   * Lifecycle: se ejecuta tras renderizar la vista.
   * Objetivo: medir alturas reales de header y footer y exponerlas como variables CSS:
   *  - --header-h y --footer-h
   */
  ngAfterViewInit(): void {
    // Actualiza --header-h con la altura real del navbar
    const header = this.elementRef.nativeElement.querySelector('.navbar') as HTMLElement | null;
    if (!header) return;

    const setVar = () =>
      document.documentElement.style.setProperty('--header-h', `${header.offsetHeight}px`);

    setVar(); // inicial
    const ro = new ResizeObserver(setVar);
    ro.observe(header);
    this.destroyRef.onDestroy(() => ro.disconnect());

    // Altura dinámica del footer -> --footer-h
    const footer = document.querySelector('app-footer') as HTMLElement | null;
    if (footer) {
      const setFooterVar = () =>
        document.documentElement.style.setProperty('--footer-h', `${footer.offsetHeight}px`);
      setFooterVar();
      const roFooter = new ResizeObserver(setFooterVar);
      roFooter.observe(footer);
      this.destroyRef.onDestroy(() => roFooter.disconnect());
    }

  }


  /**
     * Recalcula el estado "experienceActive" en función de la URL actual:
     * - Debe estar en la ruta raíz ('/') y con fragmento 'experience' para activarse.
     * - Además refresca 'scrolled' para que el navbar actualice su transparencia tras navegar.
     */
  private updateActiveByFragment() {
    const url: UrlTree = this.router.parseUrl(this.router.url);
    const primary = url.root.children['primary'];
    const onHome = (primary?.segments.map(s => s.path).join('/') ?? '') === '';
    this.experienceActive = onHome && url.fragment === 'experience';
    this.onScroll(); // refresca transparencia del navbar tras navegar
  }

  /** Alterna la apertura del menú responsive (hamburguesa). */
  toggleMenu() { this.menuOpen = !this.menuOpen; }

  /** Cierra el menú responsive. Útil al navegar o al hacer click fuera. */
  closeMenu() { this.menuOpen = false; }

/**
   * Listener de scroll global.
   * Regla de negocio:
   *  - Navbar transparente SOLO cuando estamos en Home ('/') y en la parte muy superior (scrollY <= 10).
   *  - En cualquier otra situación, se aplica fondo/sombra (scrolled = true).
   */
  @HostListener('window:scroll', [])
  onScroll() {
    // Navbar transparente solo en Home y arriba del todo
    const onHome = this.router.url.split('#')[0] === '/';
    this.scrolled = !onHome || window.scrollY > 10;
  }

  /**
   * Cierra el menú al hacer click en cualquier parte del documento fuera del <header>.
   *  - Se comprueba si el click ocurrió dentro del header (contains).
   *  - Si no y el menú está abierto, se cierra.
   *
   * Nota: Evita que el menú quede abierto tras interactuar con el contenido.
   */
  @HostListener('document:click', ['$event'])
  onClickOutside(ev: MouseEvent) {
    const inside = (this.elementRef.nativeElement
      .querySelector('header') as HTMLElement | null)
      ?.contains(ev.target as HTMLElement);
    if (!inside && this.menuOpen) this.closeMenu();
  }


}
