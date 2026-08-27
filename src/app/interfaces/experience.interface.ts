/**
 * MODELO DE EXPERIENCIA LABORAL, SE RELLENA CON DATA EXPERIENCE.DATA.TS
 */

export interface ExperienceReference {
    name: string;
    position: string;
    phone?: string;
}

export interface ExperienceTaskGroup {
    title: string;
    tasks: string[];
    fullWidth?: boolean; // Ocupa todas las columnas disponibles en layouts amplios
}

export interface Experience {
    id: string;
    company: string;
    role: string;
    start: string;          // '2024-02' o 'Feb 2024'
    end?: string;           // 'Actualidad' si sigue
    duration?: string;      // '3 meses', '1 año 2 meses', etc.
    location?: string;
    logoUrl?: string;       // '/assets/img/companies/...'
    summary?: string;       // 1–2 líneas
    tasks?: string[];       // bullets
    taskGroups?: ExperienceTaskGroup[]; // bloques temáticos de responsabilidades/logros
    tech?: string[];        // chips
    url?: string;           // enlace empresa/proyecto
    references?: ExperienceReference[]; // opcional
}
