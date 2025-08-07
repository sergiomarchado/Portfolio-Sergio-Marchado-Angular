// src/app/data/project-data.ts

import { Project } from '../interfaces/project.interface';

export const PROJECTS: Project[] = [
    {
        title: 'App de Clima',
        description: 'Aplicación que muestra el clima actual usando una API.',
        img: 'assets/img/weather-app.jpg'
    },
    {
        title: 'Gestor de Tareas',
        description: 'Organiza tareas con Angular y LocalStorage.',
        img: 'assets/img/todo-app.jpg'
    }
];
