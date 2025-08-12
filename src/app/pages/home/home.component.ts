import { Component, AfterViewInit, OnDestroy } from '@angular/core';
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

  /**
   * Registro de funciones de limpieza (removeEventListener / etc.)
   * - Se van apilando aquí y se ejecutan en ngOnDestroy.
   * - Evita fugas al cambiar de ruta o destruir el componente.
   */
  private cleanup: Array<() => void> = [];

  /**
   * El DOM ya está renderizado:
   *  - Inicializa reproducción robusta del vídeo de fondo.
   *  - Reinicia la animación de “escritura” del H1 para que arranque en cada visita.
   *  - Configura AOS (animaciones on-scroll) con una vez por carga.
   */
  ngAfterViewInit(): void {
    this.initBackgroundVideo();
    this.restartTyping();      // <- relanza la animación del H1 al entrar
    this.initAOS();
  }

  /** Ejecuta todos los “dispose” registrados. */
  ngOnDestroy(): void {
    this.cleanup.forEach(fn => fn());
  }

  /**
   * Autoplay robusto del vídeo de fondo.
   * Consideraciones:
   *  - Autoplay en móvil requiere muted + playsInline.
   *  - Si el autoplay falla (políticas del navegador), reintenta en el primer “user gesture”.
   *  - Reanuda la reproducción cuando la pestaña vuelve a ser visible.
   *  - Suscribe a eventos y los añade al array cleanup para limpiar al destruir.
   */
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

    // Función que intenta reproducir y, si no puede, programa un reintento tras gesto de usuario.
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

  /**
   * Re-lanza la animación de tipeo del fragmento “Soy Sergio Marchado”.
   * Técnica:
   *  - La animación en CSS debe estar asociada a una clase (p. ej. .type-run / .caret-run),
   *    no a los selectores base, para poder “resetearla”.
   *  - Quitamos la clase, forzamos reflow (offsetWidth) y la volvemos a añadir en el siguiente frame.
   *  - Esto hace que la animación empiece desde 0 cada vez que entras al Home.
   *   CSS usar .type-run/.caret-run para las @keyframes.
   */
  private restartTyping(): void {
    // Importante: en el CSS mueve la animación de .type-target a una clase .type-run (ver nota abajo)
    const target = document.querySelector<HTMLElement>('.type-target');
    const caret = document.querySelector<HTMLElement>('.caret');
    if (!target || !caret) return;

    // Quitamos la clase de ejecución si estaba y forzamos reflow para reiniciar
    target.classList.remove('type-run');
    caret.classList.remove('caret-run');

    // Forzar reflow (hack común para reiniciar animaciones CSS)
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    target.offsetWidth;

    // Vuelve a aplicar (siguiente tick) para que la animación arranque de 0
    requestAnimationFrame(() => {
      target.classList.add('type-run');
      caret.classList.add('caret-run');
    });
  }

  /**
   * Configura AOS (Animate On Scroll):
   *  - duration/easing: timing global de las animaciones.
   *  - once: las animaciones se ejecutan una vez (no repiten al hacer scroll arriba/abajo).
   *  - delay: retardo base (puede superponerse con data-aos-delay en HTML).
   */
  private initAOS(): void {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      delay: 100
    });
  }
}
