import { TechCategory } from '../interfaces/tech-stack.interface';

export const TECH_STACK: TechCategory[] = [
    {
        id: 'langs',
        title: 'Languages & Markup',
        iconClass: 'fas fa-code',
        items: [
            {
                label: 'Kotlin',
                iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
                level: 'expert', featured: true, about: 'Lenguaje principal para Android moderno.'
            },
            {
                label: 'Java',
                iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
                level: 'solid', about: 'POO, colecciones, concurrencia y ecosistema JVM.'
            },
            {
                label: 'TypeScript',
                iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
                level: 'solid', featured: true, about: 'Tipado estático para Angular y tooling front.'
            },
            {
                label: 'JavaScript',
                iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
                level: 'solid', about: 'Lenguaje base del frontend dinámico y APIs web.'
            },
            {
                label: 'HTML5',
                iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
                level: 'solid', about: 'Estructura semántica y accesible para la web.'
            },
            {
                label: 'CSS3',
                iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
                level: 'solid', about: 'Estilos modernos, Flexbox, Grid y animaciones.'
            },
            {
                label: 'Python',
                iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
                level: 'solid',
                about: 'Automatización, scripting y desarrollo backend con Django/Flask.'
            }
        ]
    },

    {
        id: 'mobile',
        title: 'Mobile Development',
        iconClass: 'fas fa-mobile-alt',
        items: [
            {
                label: 'Android Studio',
                iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Android_Studio_icon_%282023%29.svg/1200px-Android_Studio_icon_%282023%29.svg.png',
                level: 'expert', about: 'IDE, Gradle, perfiles y emuladores.'
            },
            {
                label: 'Jetpack Compose',
                iconUrl: 'https://developer.android.com/images/spot-icons/jetpack-compose.svg',
                level: 'solid', featured: true, about: 'UI declarativa, estado y theming (Material 3).'
            },
            {
                label: 'Material 3',
                iconUrl: 'https://developer.android.com/images/spot-icons/jetpack-compose.svg',
                level: 'solid', about: 'Guías y componentes Material Design 3 para UI moderna.'
            },
            {
                label: 'Navigation',
                iconUrl: 'https://developer.android.com/images/spot-icons/jetpack-compose.svg',
                level: 'solid', about: 'Gráficos de navegación y SafeArgs.'
            },
            {
                label: 'Room',
                iconUrl: 'https://www.kodeco.com/assets/murakami/category-icons/category-saving-data-persistence-android-9dc9eed34348d1d06a4365379fba3a54aa7aabd05d828dbb4de97349126d9718.svg',
                level: 'solid', about: 'ORM con DAO, migraciones y Flow.'
            },
            {
                label: 'Retrofit',
                iconUrl: 'assets/img/icons/ic_retrofit.webp',
                level: 'solid', about: 'HTTP client con interceptores y mapeo JSON.'
            },
            {
                label: 'Volley',
                iconUrl: 'https://icons.iconarchive.com/icons/icons8/android/512/Sports-Volleyball-icon.png',
                level: 'familiar', about: 'Networking ligero para casos puntuales.'
            },
            {
                label: 'Firebase',
                iconUrl: 'https://www.gstatic.com/devrel-devsite/prod/vce7dc8716edeb3714adfe4dd15b25490031be374149e3613a8b7fb0be9fc4a25/firebase/images/touchicon-180.png',
                level: 'solid', about: 'Backend en la nube, Firestore, Auth y hosting.'
            }
        ]
    },

    {
        id: 'frameworks',
        title: 'Frameworks',
        iconClass: 'fas fa-tools',
        items: [
            {
                label: 'Angular',
                iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
                level: 'solid', featured: true, about: 'Standalone, Signals, routing y Rx.'
            },
            {
                label: 'Spring Boot',
                iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
                level: 'solid', about: 'APIs REST, seguridad y JPA/Hibernate.'
            },
            {
                label: 'Hibernate',
                iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/hibernate/hibernate-original.svg',
                level: 'solid', about: 'ORM para Java, mapeo objeto-relacional avanzado.'
            },
            {
                label: 'JavaFX',
                iconUrl: 'https://www.tutkit.com/storage/media/packages/352/352-javafx-fuer-gui-entwicklung-main-med.webp',
                level: 'familiar', about: 'Framework para interfaces gráficas en Java.'
            }
        ]
    },

    {
        id: 'db',
        title: 'Bases de Datos',
        iconClass: 'fas fa-database',
        items: [
            {
                label: 'MySQL',
                iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
                level: 'solid', about: 'Modelado relacional, índices y consultas.'
            },
            {
                label: 'PostgreSQL',
                iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
                level: 'familiar', about: 'Funciones, tipos y rendimiento básico.'
            },
            {
                label: 'HeidiSQL',
                iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/32/HeidiSQL_logo_image.png',
                level: 'solid', about: 'Cliente ligero para gestión de MySQL y PostgreSQL.'
            },
            {
                label: 'DBeaver',
                iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/DBeaver_logo.svg',
                level: 'solid', about: 'Cliente universal para múltiples motores de base de datos.'
            },
            {
                label: 'AWS',
                iconUrl: 'https://icon2.cleanpng.com/20180817/vog/8968d0640f2c4053333ce7334314ef83.webp',
                level: 'familiar', about: 'EC2/S3 básicos y despliegue simple.'
            }
        ]
    },

    {
        id: 'tools',
        title: 'Tools & IDEs',
        iconClass: 'fas fa-wrench',
        items: [
            {
                label: 'Git',
                iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
                level: 'expert', about: 'Flujos Git, PRs y branching estratégico.'
            },
            {
                label: 'GitHub',
                iconUrl: 'https://cdn-icons-png.flaticon.com/512/733/733553.png',
                level: 'solid', about: 'Issues, Actions y gestión de repos.'
            },
            {
                label: 'IntelliJ IDEA',
                iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/IntelliJ_IDEA_Icon.svg/1200px-IntelliJ_IDEA_Icon.svg.png',
                level: 'solid', about: 'Productividad con atajos, inspecciones y plugins.'
            },
            {
                label: 'VS Code',
                iconUrl: 'https://images.icon-icons.com/3053/PNG/512/microsoft_visual_studio_code_alt_macos_bigsur_icon_189953.png',
                level: 'expert', about: 'Dev containers, extensiones y depuración.'
            },
            {
                label: 'Ubuntu',
                iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-plain.svg',
                level: 'solid', about: 'Sistema operativo Linux para desarrollo y servidores.'
            },
            {
                label: 'VirtualBox',
                iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Virtualbox_logo.png',
                level: 'familiar', about: 'Virtualización de sistemas y entornos de prueba.'
            },
            {
                label: 'OVH',
                iconUrl: 'https://e7.pngegg.com/pngimages/640/734/png-clipart-ovh-virtual-private-server-cloud-computing-web-hosting-service-dedicated-hosting-service-promotions-logo-company-text-thumbnail.png',
                level: 'familiar', about: 'Hosting VPS y gestión básica de servidores.'
            }
        ]
    },

    {
        id: 'backend',
        title: 'Backend',
        iconClass: 'fas fa-server',
        items: [
            {
                label: 'Spring Boot',
                iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
                level: 'solid', about: 'REST, validación, seguridad y empaquetado.'
            },
            {
                label: 'JWT',
                iconClass: 'fas fa-key',
                level: 'solid', about: 'Autenticación stateless y autorización por roles.'
            }
        ]
    }
];
