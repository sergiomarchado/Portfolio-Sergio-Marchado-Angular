import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render hero video element', () => {
    const video: HTMLVideoElement | null =
      fixture.nativeElement.querySelector('#bgVideo');
    expect(video).not.toBeNull();
  });

  it('should render About preview component', () => {
    const el = fixture.nativeElement.querySelector('app-about-preview');
    expect(el).not.toBeNull();
  });

  it('should render Tech Stack component', () => {
    const el = fixture.nativeElement.querySelector('app-tech-stack');
    expect(el).not.toBeNull();
  });

  it('should render Projects gallery component', () => {
    const el = fixture.nativeElement.querySelector('app-projects-gallery');
    expect(el).not.toBeNull();
  });
});
