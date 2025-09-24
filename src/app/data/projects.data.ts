import { Project } from '../interfaces/project.interface';

export const PROJECTS: Project[] = [

    {
        id: 'minicorebank',
        title: 'MiniCoreBank API',
        short: 'API REST de núcleo bancario ligero (mini core) desarrollada con <b>Java 21</b>, <b>SpringBoot 3</b>, <b>Spring Security</b>, <b>Spring Data JPA</b> y <b>Hibernate</b>. Implementa autenticación y autorización con <b>JWT</b>, gestión de usuarios, cuentas y transacciones, y está documentada con <b>OpenAPI/Swagger</b>.',
        img: 'assets/img/projects/ic_minicorebankapi.webp',
        categories: ['JAVA/BACK'],
        url: 'https://github.com/sergiomarchado/minicorebank',
    },
    {
        id: 'the-best-dam-kebap',
        title: 'THE BEST DAM KEBAB',
        short: 'App Android de comida a domicilio. Solución a pequeños negocios que no disponen de una solución nativa propia para poder ofrecer sus servicios. <br> <b>Jetpack Compose</b>, <b>Material3</b>, <b>Hilt (DI)</b>, <b>Firebase</b> y <b>DataStore</b>',
        img: 'assets/img/projects/ic_thebestdamkebab.webp',
        categories: ['ANDROID'],
        url: 'https://github.com/sergiomarchado/TheBestDAMKebap',
        videoUrl: 'https://www.youtube.com/shorts/-smwx-DZYlQ'
    },
    {
        id: 'pet-explorer',
        title: 'PET EXPLORER',
        short: 'App Android que combina <b>Jetpack Compose</b> con <b>Google Maps</b> y la <b>API de ChatGPT</b> para ayudarte a encontrar lugares pet-friendly.',
        img: 'assets/img/projects/ic_petexplorer_portfolio.webp',
        categories: ['ANDROID'],
        url: 'https://github.com/sergiomarchado/GuiaDeViajes_Android_GPT',
        videoUrl: 'https://www.youtube.com/shorts/zOBqi7hyK5I'
    },
    {
        id: 'flycheck',
        title: 'FLY CHECK',
        short: 'App Android desarrollada con <b>Jetpack Compose</b>, <b>Material3</b>, <b>Hilt (DI)</b>, Media Store, FileProvider, notificaciones, entre otras. <br>Diseñada para facilitar la creación y gestión de CheckList Aeronáuticas llevada al siguiente nivel.',
        img: 'assets/img/projects/ic_fly_check.webp',
        categories: ['ANDROID'],
        url: 'https://github.com/sergiomarchado/FlyCheck',
        videoUrl: 'https://www.youtube.com/shorts/Jy9fkklojy4'
    },
    {
        id: 'sharelist-api',
        title: 'ShareList API',
        short: 'Una <b>API RESTful</b> construida con <b>Spring Boot</b>.<br> Implementa <b>autenticación JWT</b>, gestión de usuarios y acceso seguro a recursos protegidos. Ideal como base para cualquier sistema que requiera autenticación moderna con token.',
        img: 'assets/img/projects/ic_sharelistapi_portfolio.webp',
        categories: ['JAVA/BACK'],
        url: 'https://github.com/sergiomarchado/spring-jwt-auth-api',
        videoUrl: 'https://www.youtube.com/watch?v=vFPjKX565T4'
    },
    {
        id: 'sistema-solar',
        title: 'Sistema Solar Distribuido Java + Sockets(TCP/UDP)',
        short: 'Simulación de Sistema Solar, desarrollado en Java, utilizando <b>Sockets TCP y UDP multicast</b> para la comunicación entre procesos.',
        img: 'assets/img/projects/ic_sistema_solar.webp',
        categories: ['JAVA/BACK'],
        url: 'https://github.com/sergiomarchado/SistemaSolarSocketsTCPUDP'
    },
    {
        id: 'wordle',
        title: 'Wordle Multilingüe con Android',
        short: 'Versión personalizada del clásico Wordle, desarrollada en <b>Kotlin</b> con un enfoque "tradicional" basado en <b>Fragments</b>, <b>ViewModel</b>, <b>ViewBinding</b> y <b>Navigation Component</b>.<br>El proyecto incorpora soporte <b>multilenguaje</b> y está diseñado para ofrecer una experiencia fluida tanto en modo vertical como horizontal.',
        img: 'assets/img/projects/ic_wordle.webp',
        categories: ['ANDROID'],
        url: 'https://github.com/sergiomarchado/Wordle_Android'
    }
];
