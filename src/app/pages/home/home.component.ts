import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import AOS from 'aos';

import { AboutPreviewComponent } from '../../components/about-preview/about-preview.component';
import { TechStackComponent } from '../../components/tech-stack/tech-stack.component';
import { Project } from '../../interfaces/project.interface';
import { PROJECTS } from '../../data/project.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, AboutPreviewComponent, TechStackComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {

  projects: Project[] = PROJECTS;

  ngAfterViewInit(): void {
    this.initBackgroundVideo();
    this.initAOS();
  }

  private initBackgroundVideo(): void {
    const video = document.getElementById('bgVideo') as HTMLVideoElement | null;

    if (video) {
      video.play().catch(err => {
        console.warn('⚠️ Autoplay bloqueado por el navegador:', err);
      });
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
