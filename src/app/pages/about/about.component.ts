import { Component, AfterViewInit, ElementRef, Renderer2, DestroyRef } from '@angular/core';
import { RouterModule } from '@angular/router'; // 👈
@Component({
  selector: 'app-about',
  standalone: true,                 // 👈
  imports: [RouterModule],          // 👈 habilita routerLink en tu template
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements AfterViewInit {
  private observer?: MutationObserver;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private destroyRef: DestroyRef
  ) { }

  ngAfterViewInit(): void {
    const container = this.el.nativeElement.querySelector('.timeline');
    if (!container) return;

    this.applyZigZag(container, /* startRight */ false);

    this.observer = new MutationObserver(() => {
      this.applyZigZag(container, /* startRight */ false);
    });
    this.observer.observe(container, { childList: true });

    this.destroyRef.onDestroy(() => this.observer?.disconnect());
  }

  private applyZigZag(container: Element, startRight = false) {
    const rows = Array.from(container.querySelectorAll<HTMLElement>('.t-row'));
    rows.forEach((row, idx) => {
      this.renderer.removeClass(row, 'left');
      this.renderer.removeClass(row, 'right');
      const toRight = startRight ? idx % 2 === 0 : idx % 2 === 1;
      this.renderer.addClass(row, toRight ? 'right' : 'left');
      this.renderer.setStyle(row, 'position', 'relative');
    });
  }
}
