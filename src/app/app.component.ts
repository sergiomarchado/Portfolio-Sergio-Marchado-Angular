import { Component, HostListener, ElementRef, OnInit } from '@angular/core'; // 🔄 Añade OnInit
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit { // 🔄 Implementa OnInit
  scrolled = false;
  menuOpen = false;

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.onScroll();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  @HostListener('window:scroll', [])
  onScroll() {
    this.scrolled = window.scrollY > 0;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;

    const clickedInsideHeader = this.elementRef.nativeElement
      .querySelector('header')
      ?.contains(clickedElement);

    if (!clickedInsideHeader && this.menuOpen) {
      this.closeMenu();
    }
  }
}
