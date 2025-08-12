// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CarrerComponent } from './pages/carrer/carrer.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'about', component: AboutComponent },
    {
        path: 'projects',
        loadComponent: () =>
            import('./components/projects-gallery/projects-gallery.component')
                .then(m => m.ProjectsGalleryComponent)
    },

    {
        path: 'experience',
        loadComponent: () =>
            import('./pages/carrer/carrer.component').then(m => m.CarrerComponent)
    },
    { path: 'contact', component: ContactComponent },
    {
        path: 'privacy',
        loadComponent: () => import('./pages/privacy/privacy.component').then(m => m.PrivacyComponent)
    },
    {
        path: 'cookies',
        loadComponent: () => import('./pages/cookies/cookies.component').then(m => m.CookiesComponent)
    },
    {
        path: 'legal',
        loadComponent: () => import('./pages/legal/legal.component').then(m => m.LegalComponent)
    },
    { path: '**', redirectTo: '' }


];

