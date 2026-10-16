# Informe de avance - TP3 (entrega parcial)

**Materia:** Aplicaciones Web 2  
**Proyecto:** Kinesio.Saludd  
**Fecha:** 16 de octubre de 2026  
**Punto entregado:** 3.3 - Creación de la interfaz Front-End para la administración.

## Desarrollo realizado

Se continuó el proyecto entregado en el TP2, manteniendo el sitio público, el servidor Node.js y Express y las rutas para solicitar y consultar turnos.

Para esta entrega parcial se agregó una interfaz de administración de servicios en `/admin/`. Permite visualizar y buscar servicios, agregar nuevos, editar nombre y descripción, activar o desactivar y eliminar. También se incorporaron contadores de servicios totales y activos.

## Archivos agregados

- `web/admin/index.html`: estructura HTML del panel.
- `web/admin/estilos-admin.css`: estilos del panel, siguiendo los colores y reglas básicas del sitio.
- `web/admin/admin.js`: manejo de formularios, eventos y listado.

## Estado actual y pruebas

La interfaz se ejecutó en el navegador desde `http://localhost:3000/admin/` y se probaron las operaciones de alta, edición y eliminación, además de los contadores.

En esta etapa los datos son ejemplos y se guardan en `localStorage` del navegador. **No existe todavía un CRUD de servicios conectado al servidor ni persistencia en una base de datos.**

## Para la entrega final del TP3

Quedan pendientes la estructura MVC modular con Router (3.1), los cinco endpoints CRUD de servicios y la lectura pública (3.2), una base de datos PostgreSQL o MongoDB (3.4) y la documentación de API mediante Swagger o Scalar (3.5).

El informe original del TP2 se conserva en `Informe_Kinesio_Saludd_TP2.pdf`. Este texto documenta el avance parcial y deberá incorporarse al PDF acumulativo para completar el formato de entrega indicado en 3.6.
