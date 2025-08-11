import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechStackComponent } from './tech-stack.component';

describe('TechStackComponent', () => {
  let component: TechStackComponent;
  let fixture: ComponentFixture<TechStackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechStackComponent]
    })
      .compileComponents(); // Compila las plantillas/estilos del componente de forma asíncrona.

    // Crea el "fixture": contenedor de prueba con el componente y su template renderizado.
    fixture = TestBed.createComponent(TechStackComponent);
    component = fixture.componentInstance;

    // Dispara el primer ciclo de change detection:
    // ejecuta hooks (ngOnInit, ngAfterViewInit...), evalúa bindings y renderiza la vista inicial.
    fixture.detectChanges();
  });

  it('should create', () => {
    // Smoke test básico: verifica que el componente se instancia sin errores.
    expect(component).toBeTruthy();
  });
});
