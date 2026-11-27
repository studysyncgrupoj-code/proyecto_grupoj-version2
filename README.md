# StudySync

Plataforma educativa para estudiantes, profesores y administradores.

## Tecnologías

- Frontend: React, Vite y JavaScript.
- Backend: Java 17, Spring Boot y Maven.
- Base de datos: PostgreSQL.
- Seguridad: JWT, BCrypt y autenticación en dos pasos.
- Videoconferencias: Jitsi Meet.
- Idiomas: español, inglés y portugués.

## Módulos

- Administración de usuarios.
- Cursos y lecciones.
- Salas de estudio.
- Gestión académica.
- Calendario.
- Pomodoro.
- Mensajería.
- Perfil y configuración.
- Informes y estadísticas.

## Requisitos

- Java 17.
- Maven.
- Node.js compatible con Vite.
- PostgreSQL.
- Git.

## Base de datos

Configurar PostgreSQL con la base de datos studysync
y el usuario definido en application.properties.

## Ejecutar backend

    cd backend/studysync-api
    read -rsp "Password PostgreSQL: " DB_PASSWORD
    export DB_PASSWORD
    echo
    mvn spring-boot:run

Servidor: http://localhost:8080

## Ejecutar frontend

    cd frontend
    npm ci
    npm run dev

Aplicación: http://localhost:5173

## Compilación

Backend:

    mvn clean package

Frontend:

    npm run build

## Seguridad

No publicar contraseñas, tokens ni claves privadas.

La clave local de cifrado MFA se encuentra en
~/.config/studysync/mfa.key y debe conservarse
de forma segura fuera del repositorio.

## Validaciones realizadas

- Compilación exitosa del backend.
- Compilación exitosa del frontend.
- Acceso a los tres paneles de usuario.
- Auditoría npm sin vulnerabilidades detectadas.
- Configuración de idioma y tema.

## Limitaciones pendientes

- Envío real de correos electrónicos.
- Validación integral de autenticación en dos pasos.
- Verificación de indicadores dinámicos de los dashboards.
- Pruebas integrales de permisos y persistencia.

## Versión de entrega

Rama: rescate-salas-20261117
Fecha: 27 de noviembre de 2026.
