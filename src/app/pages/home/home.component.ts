import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import AOS from 'aos';

import { AboutPreviewComponent } from '../../components/about-preview/about-preview.component';
import { TechStackComponent } from '../../components/tech-stack/tech-stack.component';
import { ProjectsGalleryComponent } from '../../components/projects-gallery/projects-gallery.component';
import { ExperienceComponent } from '../../components/experience/experience.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    AboutPreviewComponent,
    TechStackComponent,
    ProjectsGalleryComponent,
    ExperienceComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit, OnDestroy {

  private cleanup: Array<() => void> = [];

  ngAfterViewInit(): void {
    this.initBackgroundVideo();
    this.restartTyping();      // <- relanza la animación del H1 al entrar
    this.initAOS();
  }

  ngOnDestroy(): void {
    this.cleanup.forEach(fn => fn());
  }

  /** Autoplay robusto del vídeo de fondo */
  private initBackgroundVideo(): void {
    const video = document.getElementById('bgVideo') as HTMLVideoElement | null;
    if (!video) return;

    // Ajustes pro-autoplay (especialmente iOS)
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.setAttribute('playsinline', 'true'); // iOS
    video.preload = 'auto';

    const tryPlay = () => {
      video.play().catch(() => {
        // Si falla (autoplay policy), reintenta en primer gesto del usuario
        const onUserGesture = () => {
          video.play().catch(() => {/* ignoramos si sigue fallando */ });
          window.removeEventListener('pointerdown', onUserGesture, { capture: true } as any);
        };
        window.addEventListener('pointerdown', onUserGesture, { capture: true, once: true } as any);
        this.cleanup.push(() => window.removeEventListener('pointerdown', onUserGesture, { capture: true } as any));
      });
    };

    // Si ya está cargado, reproducimos; si no, esperamos al canplay/canplaythrough
    if (video.readyState >= 2) {
      tryPlay();
    } else {
      const onCanPlay = () => {
        tryPlay();
        video.removeEventListener('canplay', onCanPlay);
      };
      video.addEventListener('canplay', onCanPlay);
      this.cleanup.push(() => video.removeEventListener('canplay', onCanPlay));
    }

    // Reanudar cuando la pestaña vuelve a estar visible
    const onVis = () => {
      if (!document.hidden && video.paused) {
        tryPlay();
      }
    };
    document.addEventListener('visibilitychange', onVis);
    this.cleanup.push(() => document.removeEventListener('visibilitychange', onVis));
  }

  /** Re-lanza la animación de tipeo del fragmento “Soy Sergio Marchado” */
  private restartTyping(): void {
    // Importante: en el CSS mueve la animación de .type-target a una clase .type-run (ver nota abajo)
    const target = document.querySelector<HTMLElement>('.type-target');
    const caret = document.querySelector<HTMLElement>('.caret');
    if (!target || !caret) return;

    // Quitamos la clase de ejecución si estaba y forzamos reflow para reiniciar
    target.classList.remove('type-run');
    caret.classList.remove('caret-run');

    // Forzar reflow
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    target.offsetWidth;

    // Vuelve a aplicar (siguiente tick) para que la animación arranque de 0
    requestAnimationFrame(() => {
      target.classList.add('type-run');
      caret.classList.add('caret-run');
    });
  }

  private initAOS(): void {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      delay: 100
    });
  }
}
