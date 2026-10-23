-- Ejecutar en PostgreSQL dentro de la base kinesio_saludd
CREATE TABLE IF NOT EXISTS servicios (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(70) NOT NULL,
    descripcion VARCHAR(250) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- Datos de demostración (solo si la tabla está vacía)
INSERT INTO servicios (nombre, descripcion, activo)
SELECT datos.nombre, datos.descripcion, TRUE
FROM (VALUES
 ('Kinesiología y Fisioterapia', 'Tratamientos para mejorar la movilidad y acompañar la recuperación física.'),
 ('Rehabilitación Traumatológica', 'Recuperación de lesiones musculares, articulares y óseas.'),
 ('Kinesioterapia Respiratoria', 'Técnicas para mejorar la función respiratoria.'),
 ('Masoterapia', 'Masajes terapéuticos para aliviar tensiones musculares.'),
 ('Osteopatía', 'Tratamiento manual orientado a mejorar la movilidad.'),
 ('Punción Seca', 'Técnica de tratamiento de puntos gatillo musculares.')
) AS datos(nombre, descripcion)
WHERE NOT EXISTS (SELECT 1 FROM servicios);
