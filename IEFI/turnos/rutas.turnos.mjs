import { Router } from 'express'
import { exigirSesion, origenValido } from '../auth/rutas.auth.mjs'
import { pool } from '../bd/conexion.mjs'

const router = Router()
const apiExterna = process.env.TURNOS_API_URL

async function consultarExterna(opciones) {
    const respuesta = await fetch(apiExterna, { signal: AbortSignal.timeout(5000), ...opciones })
    if (!respuesta.ok) throw new Error('Servicio externo de turnos no disponible.')
    return respuesta.json()
}

router.get('/', exigirSesion, async (req, res) => {
    try {
        if (apiExterna) return res.json(await consultarExterna())
        const { rows } = await pool.query('SELECT id, nombre, telefono, fecha::text, hora::text, profesional FROM turnos ORDER BY fecha, hora, id')
        res.json(rows)
    } catch (error) {
        console.error(error.message)
        res.status(apiExterna ? 502 : 500).json({ mensaje: 'No se pudieron consultar los turnos.' })
    }
})

router.post('/', origenValido, async (req, res) => {
    const { nombre, telefono, fecha, hora, profesional } = req.body || {}
    const fechaValida = /^\d{4}-\d{2}-\d{2}$/.test(fecha) && fecha >= '1900-01-01' &&
        Number.isFinite(Date.parse(fecha)) && new Date(fecha).toISOString().slice(0, 10) === fecha
    if (typeof nombre !== 'string' || !nombre.trim() || nombre.trim().length > 100 ||
        typeof telefono !== 'string' || !/^[+\d ().-]{6,30}$/.test(telefono.trim()) ||
        !fechaValida || !/^([01]\d|2[0-3]):[0-5]\d$/.test(hora) ||
        !['Rocio', 'Agustina'].includes(profesional)) {
        return res.status(400).json({ mensaje: 'Revisá el nombre, teléfono, fecha, horario y profesional.' })
    }

    const turno = { nombre: nombre.trim(), telefono: telefono.trim(), fecha, hora, profesional }
    try {
        if (apiExterna) {
            const datos = await consultarExterna({
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(turno)
            })
            return res.status(201).json(datos)
        }
        const { rows } = await pool.query(
            'INSERT INTO turnos (nombre, telefono, fecha, hora, profesional) VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre, telefono, fecha::text, hora::text, profesional',
            Object.values(turno)
        )
        res.status(201).json(rows[0])
    } catch (error) {
        console.error(error.message)
        res.status(apiExterna ? 502 : 500).json({ mensaje: 'No se pudo registrar el turno.' })
    }
})

export default router
