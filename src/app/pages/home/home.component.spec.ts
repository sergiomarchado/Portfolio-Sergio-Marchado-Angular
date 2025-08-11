import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';

/**
 * Pruebas unitarias básicas del HomeComponent.
 * - Verifica la creación del componente.
 * - Comprueba la presencia de elementos clave en el template:
 *   • Vídeo de héroe (#bgVideo)
 *   • Secciones/child components: about preview, tech stack, projects gallery
 *
 * Nota: Son pruebas de “smoke test” (existencia en el DOM renderizado).
 * Si más adelante añades lógica (inputs/outputs/cambios de estado), conviene
 * ampliar con pruebas de interacción y estados específicos.
 */

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // HomeComponent es standalone, así que se importa directamente.
      imports: [HomeComponent],
    }).compileComponents();

    // Crea la instancia del componente y su fixture (wrapper de test).
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    // Dispara el primer ciclo de detección de cambios para renderizar el template.
    fixture.detectChanges();
  });

  it('should create', () => {
    // El componente se instancia correctamente.
    expect(component).toBeTruthy();
  });

  it('should render hero video element', () => {
    // Busca el <video id="bgVideo"> del héroe.
    const video: HTMLVideoElement | null =
      fixture.nativeElement.querySelector('#bgVideo');
    expect(video).not.toBeNull();
  });

  it('should render About preview component', () => {
    // Verifica que el child <app-about-preview> existe en el DOM.
    const el = fixture.nativeElement.querySelector('app-about-preview');
    expect(el).not.toBeNull();
  });

  it('should render Tech Stack component', () => {
    // Verifica que el child <app-tech-stack> existe en el DOM.
    const el = fixture.nativeElement.querySelector('app-tech-stack');
    expect(el).not.toBeNull();
  });

  it('should render Projects gallery component', () => {
    // Verifica que el child <app-projects-gallery> existe en el DOM.
    const el = fixture.nativeElement.querySelector('app-projects-gallery');
    expect(el).not.toBeNull();
  });
});
