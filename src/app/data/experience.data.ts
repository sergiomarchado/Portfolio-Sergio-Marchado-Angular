import { Experience } from '../interfaces/experience.interface';

export const EXPERIENCE: Experience[] = [
    {
        id: 'fullstack-sinergia',
        company: 'Sinergia FP',
        role: 'Full Stack Developer (prácticas)',
        start: '03/2025',
        end: '06/2025',
        duration: '3 meses',
        location: 'Madrid, España',
        logoUrl: '/assets/img/companies/ic_sinergia.webp',
        summary: 'Durante mis prácticas en Sinergia FP, participe en <strong>tareas de backed y frontend</strong> funcional, en entornos de prueba y producción.',
        tasks: [
            'Trabajo en entornos virtualizados de prueba usando <strong>Oracle VirtualBox</strong>, <strong>Ubuntu</strong> y <strong>PuTTY</strong>.',
            'Personalización de Moodle con <strong>PHP, HTML, SCSS y JavaScript</strong> según diseño establecido.',
            'Desarrollo e integración de un <strong>navbar dinámico y responsive personalizado</strong>, según el centro y el valor de campo personalizado dentro de Moodle (tras varias semanas de investigación para integrarlo de manera compatible con Themes).',
            '<strong>Optimización de interfaz móvil</strong> aplicando <strong>Responsive Design</strong> y mejoras de <strong>accesibilidad</strong>.',
            'Modificación de plantillas, funciones PHP y estilos manteniendo <strong>compatibilidad con plugins y hooks</strong>.',
            'Configuración y mantenimiento del <strong>entorno LAMP (Linux, Apache, MySQL, PHP)</strong> en servidores locales para desarrollo y pruebas y también en <strong>OVH Cloud</strong>.',
            '<strong>Colaboración y comunicación directa con el equipo de diseño gráfico y marketing</strong>, traduciendo propuestas visuales en componentes funcionales y atractivos.',
        ],
        tech: ['php', 'JavaScript', 'HTML', 'SCSS/CSS', 'Ubuntu', 'PuTTY', 'Moodle', 'LAMP', 'Oracle VirtualBox', 'OVH Cloud', 'MySQL', 'Scrum'],
        references: [
            { name: 'Leandro Amarfil', position: 'Responsable Técnico LMS', phone: '+34 674 01 15 38' },
        ],
        url: 'https://sinergiafp.es/'
    },
    {
        id: 'expendedor-gasolinera',
        company: 'Repsol / Ayessa Estaciones de Servicio',
        role: 'Expendedor de Estaciones de Servicio',
        start: '05/2013',
        end: '09/2024',
        duration: '11 años y 4 meses',
        location: 'Madrid, España',
        logoUrl: '/assets/img/companies/ic_repsol.webp',
        summary: 'Gestión integral de operaciones en estaciones de servicio, atención al cliente y formación de nuevos empleados, garantizando seguridad, eficiencia y un servicio de excelencia.',
        tasks: [
            '<strong>Formación y mentoría</strong> a nuevos integrantes del equipo, transmitiendo procedimientos y mejores prácticas. <em><strong>Filosofía:</strong> "Cuando entras en un puesto nuevo, no tienes herramientas para defenderte. Cuantas mas herramientas vayas adquiriendo para solucionar problemas, mejor desempeño tendrás en el puesto".</em>',
            'Atención personalizada a clientes, asesorando sobre productos y servicios para mejorar su experiencia.',
            'Funciones propias del cargo, como: gestión de cobros, control de caja, reposición y control de stock de productos y combustible.',
            'Supervisión y cumplimiento de protocolos de seguridad y prevención de riesgos.',
            '<strong>Resolución ágil de incidencias en entornos de alta demanda</strong>, manteniendo la calma y priorizando la satisfacción del cliente.',
            '<strong>Colaboración constante y trabajo en equipo</strong> para cumplir objetivos y mantener estándares de calidad y servicio.'
        ],
        tech: [
            'Atención al cliente',
            'Trabajo en equipo',
            'Resolución de problemas',
            'Gestión de caja',
            'Seguridad laboral',
            'Ventas',
            'Formación de personal',
            'Rendimiento bajo presión'
        ], references: [
            { name: 'Estación de Servicio Coslada (Jesús)', position: 'Telf:', phone: '91 671 50 49' },
        ]
    }
    ,
    {
        id: 'pilotodrones',
        company: '(trabajos propios)',
        role: 'Piloto de Drones',
        start: '09/2018',
        end: '03/2020',
        duration: '1 año y 6 meses',
        location: 'Madrid, España',
        logoUrl: '/assets/img/companies/drones.webp',
        summary: 'Operaciones con UAV para captura aérea y postproducción: edición de vídeo/foto, planificación de rutas autónomas con Python y generación de mapas/modelos 3D.',
        tasks: [
            'Planificación y ejecución de vuelos (manual y autónomo) con <strong>waypoints</strong> y control de misiones.',
            'Automatización de rutas con <strong>Python</strong> (DroneKit/MAVSDK): carga de misiones, monitorización de telemetría y ejecución segura.',
            'Captura y postproducción de material audiovisual: <strong>Premiere Pro</strong>, <strong>After Effects</strong> y <strong>Photoshop</strong> (color, estabilización, motion graphics y corrección de imagen).',
            'Procesado fotogramétrico para mapas y modelos 3D con <strong>OpenDroneMap/WebODM</strong> (orthomosaics, point clouds, DEMs).',
            'Gestión de baterías/equipos y checklist de seguridad antes de vuelo; análisis de condiciones y cumplimiento de normativa en zonas de operación.',
            'Entrega de resultados optimizados para web y presentación (clips editados, ortomosaicos y modelos 3D).'
        ],
        tech: [
            'Python (DroneKit/MAVSDK)',
            'OpenDroneMap/WebODM',
            'Premiere Pro',
            'After Effects',
            'Photoshop',
            'Planificación de misiones',
            'Fotogrametría',
            'Seguridad operativa'
        ]
    }

];
