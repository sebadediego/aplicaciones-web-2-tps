# TP3 — Kinesio.Saludd

Aplicaciones Web 2 — entrega final (23/10/2026).

## Trabajo realizado
- Sitio público en `/` con servicios activos obtenidos de la API.
- Panel en `/admin/` para agregar, modificar, eliminar y consultar servicios.
- API de servicios organizada por módulo con Modelo, Controlador y Router.
- Datos persistidos en PostgreSQL.
- Documentación de API en `/api-docs/` usando Scalar.
- Se mantienen las rutas de turnos del TP2.

## Configuración
1. Crear la base `kinesio_saludd` en PostgreSQL.
2. Ejecutar `bd/servicios.sql` sobre esa base.
3. Copiar `.env.ejemplo` como `.env` y escribir las credenciales reales. El archivo `.env` está en `.gitignore`.

## Ejecución
Con Node.js 22 o superior, desde la carpeta `TP3`:

```bash
pnpm install
pnpm start
```

Visitar `http://localhost:3000`, `http://localhost:3000/admin/` o `http://localhost:3000/api-docs/`.

## API
| Método | Ruta | Acción |
|---|---|---|
| GET | /api/servicios | Listar |
| GET | /api/servicios/:id | Consultar uno |
| POST | /api/servicios | Agregar |
| PUT | /api/servicios/:id | Modificar |
| DELETE | /api/servicios/:id | Eliminar |

El JSON para POST y PUT incluye `nombre`, `descripcion` y `activo`.

## Archivos de entrega
- Código: carpeta TP3.
- Script para recrear la base de datos: `bd/servicios.sql`.
- Informe: carpeta `documentacion/`. Revisar que el PDF acumulativo TP1+TP2+TP3 refleje esta entrega.
- Adjuntar también el enlace a GitHub Projects.

**Seguridad:** en TP3 todavía no se implementan autenticación ni permisos de administrador (eso corresponde al TP4). Ejecutar como práctica local y no publicar el panel sin protección.

**Pruebas:** las operaciones deben comprobarse localmente con PostgreSQL en funcionamiento.
