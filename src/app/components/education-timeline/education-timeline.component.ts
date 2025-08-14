import { AfterViewInit, Component, DestroyRef, OnDestroy, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

type EduItem = {
  id: string;
  degree: string;
  school: string;
  schoolUrl?: string;
  start: string;
  end: string;
  location?: string;
  details?: string;
  highlights?: string[];
  tags?: string[];
  logoUrl?: string;
};

type CourseItem = {
  id: string;
  title: string;
  provider: string;
  year?: string;
  imageUrl?: string; // portada/miniatura
  url?: string;      // enlace externo (Udemy, etc.)
  pdfUrl?: string;   // certificado en PDF
};

@Component({
  selector: 'app-education-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './education-timeline.component.html',
  styleUrl: './education-timeline.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EducationTimelineComponent implements AfterViewInit, OnDestroy {

  // ====== DATA DEMO (cámbiala por la tuya) ======
  readonly education = signal<EduItem[]>([
    {
      id: 'dam',
      degree: 'Técnico Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)',
      school: 'CES Juan Pablo II',
      schoolUrl: 'https://cesjuanpablosegundo.es/',
      start: '2023',
      end: '2025',
      location: 'Madrid (Alcorcón)',
      details: 'Programación orientada a objetos, bases de datos, interfaces, servicios y despliegue.',
      highlights: ['Proyecto final Android', 'Prácticas en empresa (Sinergia FP)'],
      tags: ['Java', 'Kotlin', 'Desarrollo Android', 'SQL', 'Git', 'GitHub', 'Angular', 'Python', 'JavaFX']
    },
    {
      id: 'drones',
      degree: 'Piloto de Drones',
      school: 'Aviation VIP / Buero Vallejo',
      schoolUrl: 'https://aviationvip.com/',
      start: '2018',
      end: '2018',
      location: 'Coslada (Madrid)',
      details: 'Planificación de rutas autónomas con Python. Habilidades complementarias como: edición de vídeo y fotografía, teledetección, modelado 3d.',
      highlights: ['Automatización de rutas con Python (DroneKit/MAVSDK): carga de misiones, monitorización de telemetría y ejecución segura.', 'Procesado fotogramétrico para mapas y modelos 3D con OpenDroneMap/WebODM (orthomosaics, point clouds, DEMs).'],
      tags: ['Edición de vídeo y fotografía', 'Teledetección', 'Modelado 3d', 'Python']
    },
    {
      id: 'economia',
      degree: 'Grado en Economía',
      school: 'Universidad de Alcalá de Henares',
      schoolUrl: 'https://uah.es/es/',
      start: '2009',
      end: '2013 (no finalizado)',
      location: 'Alcalá de Henares',
      details: 'Base cuantitativa (micro/macro, estadística, econometría) aplicada a toma de decisiones y orientación a métricas.',
      highlights: [
        'Pensamiento analítico y modelado: descomponer problemas complejos y priorizar soluciones.',
        'Estadística/Econometría: regresión, contraste de hipótesis y lectura crítica de datos.',
        'KPIs y reporting: cuadros de mando en Excel y storytelling con datos.',
        'Trabajo en equipo y comunicación con perfiles no técnicos (producto/negocio).'
      ],
      tags: [
        'Estadística',
        'Econometría',
        'Análisis de datos',
        'Excel (avanzado)',
        'KPIs',
        'Pensamiento crítico',
        'Comunicación',
        'Finanzas',
        'Modelado'
      ]
    }
  ]);

  readonly courses = signal<CourseItem[]>([
    {
      id: 'jetpackcompose',
      title: 'Jetpack Compose: Curso definitivo desde 0 [2025]',
      provider: 'Udemy',
      year: '2025',
      imageUrl: 'assets/img/certificates/jetpackcomposearis.webp',
      url: 'https://www.udemy.com/course/jetpack-compose-desde-0-a-profesional/',
      pdfUrl: 'https://www.udemy.com/certificate/UC-32c9ee64-db1a-4ebf-a58e-4cd5ca21c579/'
    },
    {
      id: 'javaudemy',
      title: 'Máster Completo en Java de cero a experto 2025 +180 hrs',
      provider: 'Udemy',
      year: '2025',
      imageUrl: 'assets/img/certificates/javaudemy.webp',
      url: 'https://www.udemy.com/course/master-completo-java-de-cero-a-experto/',
      pdfUrl: 'https://www.udemy.com/certificate/UC-13db953b-5501-4323-ac3a-0938d5044300/'
    }
  ]);
  // ==============================================

  private io?: IntersectionObserver;

  constructor(private destroyRef: DestroyRef) { }

  ngAfterViewInit(): void {
    const container = document.querySelector<HTMLElement>('.ed-timeline');
    const courses = document.querySelector<HTMLElement>('.ed-courses');

    const makeObserver = (el?: HTMLElement | null) => {
      if (!el) return;
      el.classList.add('reveal-ready');
      this.io ??= new IntersectionObserver(
        entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('in-view')),
        { threshold: 0.18 }
      );
      this.io.observe(el);
    };

    makeObserver(container);
    makeObserver(courses);
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }

  // Helpers
  open(link?: string) {
    if (link) window.open(link, '_blank', 'noopener');
  }
  trackEdu = (_: number, it: EduItem) => it.id;
  trackCourse = (_: number, it: CourseItem) => it.id;
}
