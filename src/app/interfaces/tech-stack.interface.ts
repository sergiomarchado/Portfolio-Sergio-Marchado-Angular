export type SkillLevel = 'expert' | 'solid' | 'familiar';

export interface TechItem {
    label: string;
    iconClass?: string;   // ej. 'devicon-xxx-plain colored' o 'fas fa-key'
    iconUrl?: string;     // ruta a svg/png (https://... o assets/icons/...)
    level?: SkillLevel;   // para el anillo: expert/solid/familiar
    featured?: boolean;   // para destacar en “top skills” si lo usas
    about?: string;       // breve descripción que mostramos bajo el label
}

export interface TechCategory {
    id: string;           // 'langs' | 'mobile' | ...
    title: string;        // Título visible
    iconClass?: string;   // icono del título
    items: TechItem[];
}
