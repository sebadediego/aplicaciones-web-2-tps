# Kinesio.Saludd

Aplicaciones Web 2 · IEFI · Sebastián De Diego · Comisión MB

Sitio público para un consultorio de kinesiología, formulario de solicitudes de turnos y panel privado para administrar los servicios. Node.js, Express y PostgreSQL.

## Preparar el proyecto

1. Instalá Node.js 22.9 o superior y tené PostgreSQL activo. Si usás Docker Desktop, podés iniciar un PostgreSQL nuevo con el comando de abajo.
2. Desde esta carpeta, ejecutá `pnpm install --frozen-lockfile`.
3. Copiá `.env.ejemplo` como `.env`. Completá `DB_PASSWORD` con la contraseña de PostgreSQL y configurá `ADMIN_EMAIL` y `ADMIN_PASSWORD` con un correo y una contraseña de prueba propia de al menos 12 caracteres.
4. Generá un secreto con `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"` y pegá el resultado en `JWT_SECRET`.
5. Ejecutá `pnpm db:init` y después `pnpm start`. Abrí [el sitio](http://localhost:3000/) o [el panel](http://localhost:3000/admin/).

```sh
docker run --name kinesio-postgres -p 127.0.0.1:5432:5432 -e POSTGRES_PASSWORD=TU_CLAVE_POSTGRES -e POSTGRES_DB=kinesio_saludd -d postgres:17
```

Si el contenedor ya existe, usá `docker start kinesio-postgres`. Esperá a que PostgreSQL acepte conexiones. Si tenés una instalación local, podés usarla con sus propios datos en `.env`.

`db:init` prepara las tablas, carga servicios de demostración cuando la tabla está vacía y crea el usuario configurado si todavía falta. Crea la base indicada si el usuario de PostgreSQL tiene permiso para ello. Con una cuenta sin ese permiso, creá primero la base con una cuenta administradora. El comando conserva los datos existentes. Si volvés a ejecutarlo con el mismo correo, conserva su contraseña original.

Las solicitudes de turno se guardan en PostgreSQL por defecto para que la corrección sea local. Para demostrar la integración del TP2 con MockAPI podés configurar `TURNOS_API_URL` con un recurso propio y usar datos ficticios.

## Uso

- En **Contacto**, completá el formulario y comprobá el mensaje en la misma pantalla. El formulario registra una solicitud para el consultorio.
- En **Administración**, iniciá sesión con la cuenta configurada. Probá alta, edición y baja de un servicio y comprobá cómo cambia el catálogo público según su estado.
- Cerrá sesión y verificá que el panel vuelva a mostrar el formulario de ingreso.

## Rutas de la API

| Método | Ruta | Acceso | Uso |
| --- | --- | --- | --- |
| GET | /api/servicios | Público | Listar servicios |
| GET | /api/servicios/:id | Público | Consultar un servicio |
| POST | /api/servicios | Privado | Crear un servicio |
| PUT | /api/servicios/:id | Privado | Modificar un servicio |
| DELETE | /api/servicios/:id | Privado | Eliminar un servicio |
| GET | /api/turnos | Privado | Consultar solicitudes |
| POST | /api/turnos | Público | Registrar una solicitud |
| POST | /api/auth/login | Público | Validar credenciales y emitir la cookie |
| GET | /api/auth/sesion | Privado | Verificar la sesión actual |
| POST | /api/auth/logout | Sesión actual | Revocar la sesión y borrar la cookie |

El JSON de servicios incluye `nombre`, `descripcion` y `activo`. El JSON de turnos incluye `nombre`, `telefono`, `fecha` (AAAA-MM-DD), `hora` (HH:mm) y `profesional` (Rocio o Agustina). Para ingresar se envían `email` y `clave`. El cierre de sesión acepta un objeto JSON vacío. La documentación interactiva de Scalar se encuentra en [la documentación de la API](http://localhost:3000/api-docs/). El visor se carga desde CDN. El archivo OpenAPI también se incluye en `web/api-docs/openapi.json`.

## Seguridad

La contraseña se deriva con scrypt y una sal aleatoria. El JWT de acceso se firma con HS256 y vence a los 30 minutos. Se envía en una cookie HttpOnly y SameSite=Strict. Las rutas privadas validan la firma, el vencimiento y una sesión vigente en PostgreSQL. Cerrar sesión revoca ese acceso en la base. La aplicación sirve interfaz y API desde el mismo origen. Para usar HTTPS en producción, configurá `NODE_ENV=production` y `APP_ORIGIN` con el origen exacto. En ese entorno la cookie incorpora Secure.

## Historial del proyecto

- [Base de Kinesio.Saludd y propuesta](https://github.com/sebadediego/aplicaciones-web-2-kinesiologia)
- [Repositorio de trabajos prácticos](https://github.com/sebadediego/aplicaciones-web-2-tps)
- [Tablero de seguimiento](https://github.com/users/sebadediego/projects/1)

