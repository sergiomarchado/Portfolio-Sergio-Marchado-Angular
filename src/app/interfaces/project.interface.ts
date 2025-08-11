/**
 * MODELO DE PROYECTO, SE RELLENA CON DATA PROJECTS.DATA.TS
 */

export type ProjectCategory = 'ANDROID' | 'JAVA/BACK' | 'ANGULAR' | 'PYTHON';

export interface Project {
    id: string;
    title: string;
    short: string;
    img: string;             // ruta en /public/assets/...
    categories: ProjectCategory[];
    url?: string;            // opcional: enlace a GitHub/Store/etc
}
