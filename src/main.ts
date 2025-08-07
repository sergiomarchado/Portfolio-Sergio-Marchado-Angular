import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';


// Importamos AOS y sus estilos
import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
