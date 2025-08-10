import {
  Component, HostListener, ElementRef, OnInit, AfterViewInit, DestroyRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd, UrlTree } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit {
  scrolled = false;
  menuOpen = false;
  experienceActive = false;

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private destroyRef: DestroyRef
  ) { }

  ngOnInit(): void {
    this.onScroll();
    this.updateActiveByFragment(); // estado correcto al primer render
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.updateActiveByFragment());
  }

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
  }

  private updateActiveByFragment() {
    const url: UrlTree = this.router.parseUrl(this.router.url);
    const primary = url.root.children['primary'];
    const onHome = (primary?.segments.map(s => s.path).join('/') ?? '') === '';
    this.experienceActive = onHome && url.fragment === 'experience';
    this.onScroll(); // refresca transparencia del navbar tras navegar
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  closeMenu() { this.menuOpen = false; }

  @HostListener('window:scroll', [])
  onScroll() {
    // Navbar transparente solo en Home y arriba del todo
    const onHome = this.router.url.split('#')[0] === '/';
    this.scrolled = !onHome || window.scrollY > 10;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(ev: MouseEvent) {
    const inside = (this.elementRef.nativeElement
      .querySelector('header') as HTMLElement | null)
      ?.contains(ev.target as HTMLElement);
    if (!inside && this.menuOpen) this.closeMenu();
  }
}
