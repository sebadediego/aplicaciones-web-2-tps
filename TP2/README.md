# Kinesio.Saludd

Este proyecto es una página para un consultorio de kinesiología de Río Primero.

La página tiene información del consultorio, los servicios y una parte para solicitar turnos.

Para esta parte se agregó Node.js con Express para levantar la página desde un servidor y también se conectó con MockAPI para guardar los turnos.

Los turnos tienen estos datos:

- nombre
- teléfono
- fecha
- hora
- profesional

Las rutas que se usan son:

`GET /api/turnos`

Sirve para ver los turnos guardados.

`POST /api/turnos`

Sirve para guardar un turno nuevo.

Para ejecutar el proyecto primero se instalan las dependencias:

```bash
pnpm install