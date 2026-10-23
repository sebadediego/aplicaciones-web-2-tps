import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import rutasServicios from './servicios/rutas.servicios.mjs'

const app = express()
const puerto = Number(process.env.PORT || 3000)
const directorio = path.dirname(fileURLToPath(import.meta.url))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(directorio, 'web')))
app.use('/api/servicios', rutasServicios)

// API de turnos del TP2: se conserva sin cambios.
app.get('/api/turnos', async (req, res) => {
    try {
        const respuesta = await fetch('https://6aadc5a0606bd915d1107c9f.mockapi.io/turnos')
        if (!respuesta.ok) throw new Error('Error al consultar turnos')
        res.json(await respuesta.json())
    } catch {
        res.status(502).json({ mensaje: 'No se pudieron consultar los turnos.' })
    }
})

app.post('/api/turnos', async (req, res) => {
    try {
        const respuesta = await fetch('https://6aadc5a0606bd915d1107c9f.mockapi.io/turnos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        })
        if (!respuesta.ok) throw new Error('Error al registrar turno')
        res.json(await respuesta.json())
    } catch {
        res.status(502).json({ mensaje: 'No se pudo registrar el turno.' })
    }
})

app.listen(puerto, () => {
    console.log(`Servidor iniciado en http://localhost:${puerto}`)
})
