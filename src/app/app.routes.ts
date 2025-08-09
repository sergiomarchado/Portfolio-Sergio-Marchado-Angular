// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'about', component: AboutComponent },
    {
        path: 'projects',
        loadComponent: () =>
            import('./components/projects-gallery/projects-gallery.component')
                .then(m => m.ProjectsGalleryComponent)
    },
    { path: 'contact', component: ContactComponent },
    { path: '**', redirectTo: '' }
];
