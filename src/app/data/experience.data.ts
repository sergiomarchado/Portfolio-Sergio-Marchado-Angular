import { Experience } from '../interfaces/experience.interface';

export const EXPERIENCE: Experience[] = [


    {
        id: 'novomatic',
        company: 'Novomatic Spain',
        role: 'Lead Developer | Backend Developer',
        start: '10/2025',
        end: 'actualidad',
        duration: 'actualidad',
        location: 'Madrid, España',
        logoUrl: 'assets/img/companies/logo-novo.webp',
        summary: 'Desarrollo y modernización de aplicaciones corporativas, trabajando principalmente en backend con <strong>Java y Spring Boot</strong> y participando también en desarrollo frontend, arquitectura, integración de sistemas y evolución técnica.<br><br>Actualmente <strong>Lead Developer</strong> en el desarrollo de nueva plataforma corporativa transversal, liderando su definición técnica y evolución: arquitectura de la solución, diseño del backend, integración frontend/backend, seguridad, persistencia y criterios técnicos de desarrollo.',
        taskGroups: [
            {
                title: 'Modernización de sistemas legacy',
                tasks: [
                    'Modernización de una aplicación web legacy desarrollada con <strong>Java 8 y JSP</strong>, evolucionando progresivamente su arquitectura, dependencias y runtime hasta <strong>Java 17</strong>.',
                    'Refactorización y actualización de componentes heredados, con especial foco en la <strong>mantenibilidad, estabilidad, rendimiento y compatibilidad</strong> de la aplicación.',
                    'Diseño e implementación de nuevas funcionalidades para mejorar la <strong>trazabilidad de procesos críticos</strong>, reducir tareas manuales y optimizar los flujos de trabajo internos.',
                    'Análisis y adaptación del código existente para minimizar el impacto funcional durante la evolución tecnológica del sistema.'
                ]
            },
            {
                title: 'IoT y comunicaciones',
                tasks: [
                    'Desarrollo de soluciones para lectura y análisis de datos gracias a MQTT y MongoDB de dispositivos <strong>IoT</strong> en Java.',
                    'Implementación de procesos para la recepción, procesamiento, validación y persistencia de datos.',
                    'Integración de información mediante <strong>PostgreSQL, MongoDB y SQL Server</strong> para su almacenamiento y consulta.',
                    'Desarrollo de consultas, informes y procesos de explotación de datos para el análisis de información y métricas.'
                ]
            },
            {
                title: 'Colaboración y ciclo de desarrollo',
                fullWidth: true,
                tasks: [
                    'Colaboración con distintos equipos y departamentos para analizar necesidades, definir funcionalidades y traducir procesos de negocio a soluciones técnicas.',
                    'Participación en el ciclo completo de desarrollo: <strong>análisis, diseño técnico, implementación, pruebas, resolución de incidencias, documentación y evolución</strong> de las aplicaciones.',
                    'Definición y documentación de arquitectura, configuración, contratos entre frontend y backend y procedimientos de desarrollo para facilitar el mantenimiento y la incorporación de nuevos desarrolladores.',
                    'Desarrollo y mantenimiento de <strong>pruebas automatizadas</strong> en backend y frontend para favorecer una evolución segura y sostenible de los proyectos.'
                ]
            },
            {
                title: 'Nueva plataforma corporativa',
                fullWidth: true,
                tasks: [
                    'Liderazgo técnico como <strong>Lead Developer</strong> de una nueva plataforma corporativa transversal, definiendo la arquitectura de la solución, los criterios técnicos de desarrollo y su evolución.',
                    'Diseño y desarrollo de una <strong>API REST con Java 25 y Spring Boot</strong>, estructurada mediante Spring MVC, controladores, DTOs y validación, servicios transaccionales y persistencia con <strong>Spring Data JPA, Hibernate y PostgreSQL</strong>.',
                    'Implementación de mecanismos de <strong>autenticación y autorización con Spring Security</strong>, incluyendo gestión de sesiones mediante cookies HTTP-only, MFA, protección CSRF y control de acceso basado en roles y permisos.',
                    'Desarrollo de funcionalidades de <strong>auditoría, histórico y trazabilidad</strong> para el seguimiento de operaciones y modificaciones realizadas sobre la información gestionada por la plataforma.',
                    'Desarrollo de una <strong>SPA con JavaScript nativo y Vite</strong>, utilizando una arquitectura modular basada en vistas, controladores, navegación, estado, seguridad y clientes HTTP.',
                    'Integración frontend/backend mediante <strong>Fetch y APIs REST</strong>, con navegación basada en History API y adaptación de rutas y acciones de interfaz a los permisos proporcionados por el servidor.',
                    'Desarrollo de procesos de gestión documental y ficheros, manteniendo en <strong>PostgreSQL</strong> sus metadatos, relaciones e información asociada.',
                    'Análisis y diseño de la evolución de la plataforma para incorporar capacidades de <strong>IA generativa mediante una arquitectura RAG local</strong>, planteada como un servicio independiente integrado con el backend Java para la consulta contextual de documentación corporativa.'
                ]
            }
        ],
        tech: [
            'Java 8',
            'Java 17',
            'Java 25',
            'Spring Boot',
            'Spring MVC',
            'Spring Security',
            'Spring Data JPA',
            'Hibernate',
            'JDBC',
            'JUnit 5',
            'JSP',
            'JSTL',
            'PostgreSQL',
            'MongoDB',
            'SQL Server',
            'REST API',
            'OpenAPI',
            'Swagger',
            'JavaScript',
            'Vite',
            'HTML',
            'CSS',
            'Fetch API',
            'History API',
            'MQTT',
            'IoT',
            'Maven',
            'Tomcat',
            'Git',
            'Bitbucket',
            'Jira',
            'Confluence',
            'Scrum',
            'Postman',
            'IntelliJ IDEA'
        ],
        references: [
            { name: 'Jose Manuel Morales', position: 'Responsable I+D', phone: '' },
        ],
        url: 'https://www.novomatic-spain.com/'
    },
    {
        id: 'fullstack-sinergia',
        company: 'Sinergia FP',
        role: 'Full Stack Developer (prácticas DAM)',
        start: '03/2025',
        end: '08/2025',
        duration: '5 meses',
        location: 'Madrid, España',
        logoUrl: 'assets/img/companies/ic_sinergia.webp',
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
        logoUrl: 'assets/img/companies/ic_repsol.webp',
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
        logoUrl: 'assets/img/companies/drones.webp',
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
