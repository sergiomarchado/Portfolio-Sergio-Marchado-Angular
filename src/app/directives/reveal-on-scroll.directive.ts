import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';

let revealObserver: IntersectionObserver | undefined;

function getRevealObserver(): IntersectionObserver {
  revealObserver ??= new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      (entry.target as HTMLElement).classList.add('motion-visible');
      revealObserver?.unobserve(entry.target);
    }),
    { threshold: 0.08, rootMargin: '0px 0px -48px 0px' }
  );

  return revealObserver;
}

@Directive({
  selector: '[appReveal]',
  standalone: true,
  host: { class: 'motion-reveal' }
})
export class RevealOnScrollDirective implements AfterViewInit, OnDestroy {
  @Input() appReveal = 'fade-up';
  @Input() revealDelay = '0';

  private observer?: IntersectionObserver;

  constructor(private readonly elementRef: ElementRef<HTMLElement>) { }

  ngAfterViewInit(): void {
    const element = this.elementRef.nativeElement;
    const delay = Math.max(0, Number(this.revealDelay) || 0);
    element.style.setProperty('--motion-delay', `${Math.min(delay, 400)}ms`);

    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.classList.add('motion-visible');
      return;
    }

    this.observer = getRevealObserver();
    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.unobserve(this.elementRef.nativeElement);
  }
}
