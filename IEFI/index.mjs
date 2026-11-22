import express from 'express'
import { fileURLToPath } from 'node:url'
import rutasServicios from './servicios/rutas.servicios.mjs'
import rutasAuth from './auth/rutas.auth.mjs'
import rutasTurnos from './turnos/rutas.turnos.mjs'

if (!/^[0-9a-f]{64}$/i.test(process.env.JWT_SECRET || '')) {
    throw new Error('Configurá JWT_SECRET con 64 caracteres hexadecimales aleatorios en .env.')
}
if (process.env.NODE_ENV === 'production' && !process.env.APP_ORIGIN?.startsWith('https://')) {
    throw new Error('Configurá APP_ORIGIN con el origen HTTPS de la aplicación.')
}

export const app = express()
const puerto = Number(process.env.PORT || 3000)

app.disable('x-powered-by')
app.use((req, res, next) => {
    res.set('X-Content-Type-Options', 'nosniff')
    res.set('X-Frame-Options', 'DENY')
    next()
})
app.use(express.json({ limit: '16kb' }))
app.use('/api/auth', rutasAuth)
app.use('/api/servicios', rutasServicios)
app.use('/api/turnos', rutasTurnos)
app.use('/api', (req, res) => res.status(404).json({ mensaje: 'Ruta no encontrada.' }))
app.use(express.static(fileURLToPath(new URL('./web', import.meta.url)), { redirect: false }))
app.get('/admin', (req, res) => res.sendFile(fileURLToPath(new URL('./web/admin/index.html', import.meta.url))))
app.use((error, req, res, next) => {
    if (res.headersSent) return next(error)
    if (error.type === 'entity.parse.failed') return res.status(400).json({ mensaje: 'El JSON enviado no es válido.' })
    if (error.type === 'entity.too.large') return res.status(413).json({ mensaje: 'La solicitud es demasiado grande.' })
    console.error(error)
    res.status(500).json({ mensaje: 'Ocurrió un error. Intentá nuevamente.' })
})

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
    app.listen(puerto, () => console.log(`Servidor iniciado en http://localhost:${puerto}`))
}
