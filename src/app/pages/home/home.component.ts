import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import AOS from 'aos';

import { AboutPreviewComponent } from '../../components/about-preview/about-preview.component';
import { TechStackComponent } from '../../components/tech-stack/tech-stack.component';
import { ProjectsGalleryComponent } from '../../components/projects-gallery/projects-gallery.component';
import { ExperienceComponent } from '../../components/experience/experience.component';
import { EducationTimelineComponent } from '../../components/education-timeline/education-timeline.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    AboutPreviewComponent,
    TechStackComponent,
    ProjectsGalleryComponent,
    ExperienceComponent,
    EducationTimelineComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  /** Ajusta aquí tus vídeos (mp4/H.264 idealmente, con bitrate razonable) */
  videos: string[] = [
    '/assets/videos/backgroundd.mp4',
    '/assets/videos/demoheader.mp4'
    // puedes añadir más...
  ];
  index = 0;          // índice actual
  activeBuf = 0;      // 0 => vidA visible, 1 => vidB visible

  private cleanup: Array<() => void> = [];

  @ViewChild('vidA', { static: false }) vidARef!: ElementRef<HTMLVideoElement>;
  @ViewChild('vidB', { static: false }) vidBRef!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit(): void {
    this.initHeroCarousel();   // configura autoplay robusto + primer vídeo
    this.restartTyping();      // mantiene tu efecto de tipeo
    this.initAOS();
  }

  ngOnDestroy(): void {
    this.cleanup.forEach(fn => fn());
  }

  /** Teclado accesible: ← y → cambian de vídeo */
  @HostListener('document:keydown', ['$event'])
  onKeydown(ev: KeyboardEvent) {
    if (ev.key === 'ArrowLeft') { ev.preventDefault(); this.prev(); }
    if (ev.key === 'ArrowRight') { ev.preventDefault(); this.next(); }
  }

  /** Ir al siguiente/anterior */
  next(): void { this.goTo((this.index + 1) % this.videos.length); }
  prev(): void { this.goTo((this.index - 1 + this.videos.length) % this.videos.length); }

  /** Núcleo: cambia el vídeo con doble buffer y crossfade */
  private goTo(newIndex: number): void {
    if (newIndex === this.index || this.videos.length === 0) return;

    const current = this.getActiveVideo();
    const nextVid = this.getInactiveVideo();
    const src = this.videos[newIndex];

    // Cargar el siguiente vídeo en el buffer inactivo
    this.setVideoSource(nextVid, src).then(() => {
      // Reproducir y hacer crossfade
      this.tryPlay(nextVid);
      // marcar activo el nuevo buffer
      this.activeBuf = this.activeBuf ^ 1;

      // parar el otro cuando termine el fade (evita corte audible si alguna vez no está muted)
      const stopOld = () => { current.pause(); current.removeEventListener('transitionend', stopOld); };
      current.addEventListener('transitionend', stopOld);
      // por si el navegador no dispara transitionend (edge cases)
      setTimeout(stopOld, 600);

      this.index = newIndex;

      // pre-carga del siguiente en un elemento off-DOM (calienta caché)
      this.preloadNext();
    });
  }

  /** Inicialización: coloca el primer vídeo y prepara pre-carga */
  private initHeroCarousel(): void {
    const first = this.getActiveVideo();
    const src = this.videos[this.index] ?? '';
    this.setVideoSource(first, src).then(() => this.tryPlay(first));

    // Reanudar cuando vuelve la pestaña
    const onVis = () => {
      const v = this.getActiveVideo();
      if (!document.hidden && v.paused) this.tryPlay(v);
    };
    document.addEventListener('visibilitychange', onVis);
    this.cleanup.push(() => document.removeEventListener('visibilitychange', onVis));

    this.preloadNext();
  }

  /** Asigna src al <video> (sin <source> hijos) y espera a que esté listo para empezar */
  private setVideoSource(el: HTMLVideoElement, src: string): Promise<void> {
    return new Promise(resolve => {
      // aseguramos ajustes pro-autoplay
      el.muted = true; el.loop = true; el.autoplay = true;
      (el as any).playsInline = true; el.setAttribute('playsinline', 'true');
      el.preload = 'auto';

      // cargar
      el.src = src;
      const onCanPlay = () => { el.removeEventListener('canplay', onCanPlay); resolve(); };
      if (el.readyState >= 2) resolve(); else el.addEventListener('canplay', onCanPlay);
      el.load();
    });
  }

  /** Intento robusto de reproducir respetando políticas de autoplay */
  private tryPlay(video: HTMLVideoElement) {
    video.play().catch(() => {
      const onUserGesture = () => {
        video.play().catch(() => {/* noop */ });
        window.removeEventListener('pointerdown', onUserGesture, { capture: true } as any);
      };
      window.addEventListener('pointerdown', onUserGesture, { capture: true, once: true } as any);
      this.cleanup.push(() => window.removeEventListener('pointerdown', onUserGesture, { capture: true } as any));
    });
  }

  /** Pre-carga del siguiente (opcional, mejora la inmediatez del cambio) */
  private preloadNext() {
    if (this.videos.length <= 1) return;
    const nextIdx = (this.index + 1) % this.videos.length;
    const preloadVideo = document.createElement('video');
    preloadVideo.preload = 'auto';
    preloadVideo.muted = true;
    preloadVideo.src = this.videos[nextIdx];
    // no lo añadimos al DOM; el navegador hará cache del recurso
  }

  private getActiveVideo(): HTMLVideoElement {
    return this.activeBuf === 0 ? this.vidARef.nativeElement : this.vidBRef.nativeElement;
  }
  private getInactiveVideo(): HTMLVideoElement {
    return this.activeBuf === 0 ? this.vidBRef.nativeElement : this.vidARef.nativeElement;
  }

  /** ---- Tus utilidades existentes ---- */
  private restartTyping(): void {
    const target = document.querySelector<HTMLElement>('.type-target');
    const caret = document.querySelector<HTMLElement>('.caret');
    if (!target || !caret) return;
    target.classList.remove('type-run');
    caret.classList.remove('caret-run');
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    target.offsetWidth;
    requestAnimationFrame(() => {
      target.classList.add('type-run');
      caret.classList.add('caret-run');
    });
  }

  private initAOS(): void {
    AOS.init({ duration: 1000, easing: 'ease-in-out', once: true, delay: 100 });
  }
}
