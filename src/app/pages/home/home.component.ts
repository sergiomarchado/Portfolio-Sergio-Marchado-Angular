import { Component, AfterViewInit } from '@angular/core';
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
export class HomeComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    this.initBackgroundVideo();
    this.initAOS();
  }

  private initBackgroundVideo(): void {
    const video = document.getElementById('bgVideo') as HTMLVideoElement | null;

    if (video) {
      video.addEventListener('canplay', () => {
        console.log('🎬 canplay fired — el vídeo está listo para reproducir');
      });

      video.play().catch(err => {
        console.warn('⚠️ Autoplay bloqueado por el navegador:', err);
      });
    } else {
      console.error('❌ No se encontró el elemento de vídeo en el DOM');
    }
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
