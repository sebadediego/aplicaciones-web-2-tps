import { pool } from '../bd/conexion.mjs'

export async function listar() {
    const resultado = await pool.query('SELECT id, nombre, descripcion, activo FROM servicios ORDER BY id')
    return resultado.rows
}

export async function buscar(id) {
    const resultado = await pool.query('SELECT id, nombre, descripcion, activo FROM servicios WHERE id = $1', [id])
    return resultado.rows[0]
}

export async function agregar(datos) {
    const resultado = await pool.query(
        'INSERT INTO servicios (nombre, descripcion, activo) VALUES ($1, $2, $3) RETURNING *',
        [datos.nombre, datos.descripcion, datos.activo]
    )
    return resultado.rows[0]
}

export async function modificar(id, datos) {
    const resultado = await pool.query(
        'UPDATE servicios SET nombre = $1, descripcion = $2, activo = $3 WHERE id = $4 RETURNING *',
        [datos.nombre, datos.descripcion, datos.activo, id]
    )
    return resultado.rows[0]
}

export async function eliminar(id) {
    const resultado = await pool.query('DELETE FROM servicios WHERE id = $1 RETURNING *', [id])
    return resultado.rows[0]
}
