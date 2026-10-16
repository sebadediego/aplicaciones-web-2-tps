# TP3 — Kinesio.Saludd
## Entrega parcial — 16/10/2026
Se toma como base el proyecto del TP2, conservando el sitio público, servidor Express y API de turnos.
### Punto realizado: 3.3 — Interfaz Front-End para la administración
Se incorporó una interfaz de administración de **servicios** en `/admin/`:
- Listado y búsqueda de servicios.
- Formulario de alta y modificación.
- Acción para eliminar servicios y marcar activos/inactivos.
- Contadores de servicios totales y activos.
- Diseño adaptable a pantallas pequeñas.

**Alcance de la entrega parcial:** la interfaz usa datos de demostración y `localStorage`; no está conectada todavía a un CRUD de servicios ni a una base de datos. Los servicios de ejemplo sirven para ilustrar el funcionamiento del panel y no son contenido validado por el consultorio.

### Ejecutar
Dentro de `TP3`:
```bash
pnpm install
node index.mjs
```
Abrir http://localhost:3000/admin/ para administrar servicios o http://localhost:3000 para ver la web pública.

## Pendiente para la entrega final — 23/10/2026
- 3.1: estructura modular MVC y Router.
- 3.2: API de servicios con cinco endpoints y lectura pública; configurar CORS si corresponde.
- 3.4: persistencia en PostgreSQL o MongoDB.
- 3.5: documentación de API con Swagger o Scalar.
- 3.6: informe integrado, script de BD y enlaces de entrega.

Se conserva la versión del TP2 en su propia carpeta, sin modificaciones.
