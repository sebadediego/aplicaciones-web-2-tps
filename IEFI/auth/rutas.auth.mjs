import { randomUUID } from 'node:crypto'
import { Router } from 'express'
import { pool } from '../bd/conexion.mjs'
import { crearToken, verificarClave, verificarToken, vigencia } from './seguridad.mjs'

const nombreCookie = 'kinesio_sesion'
const cookie = { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/' }
const intentos = new Map()
let validacionesActivas = 0

function leerToken(req) {
    const prefijo = nombreCookie + '='
    const valor = req.headers.cookie?.split(';').map(parte => parte.trim())
        .find(parte => parte.startsWith(prefijo))
    return verificarToken(valor?.slice(prefijo.length))
}

export function origenValido(req, res, next) {
    const origen = req.get('Origin')
    const esperado = process.env.APP_ORIGIN || req.protocol + '://' + req.get('Host')
    if ((origen && origen !== esperado) || req.get('Sec-Fetch-Site') === 'cross-site') {
        return res.status(403).json({ mensaje: 'Solicitud fuera del sitio.' })
    }
    if (req.method !== 'DELETE' && !req.is('application/json')) {
        return res.status(415).json({ mensaje: 'La solicitud debe enviarse en JSON.' })
    }
    next()
}

export async function exigirSesion(req, res, next) {
    res.set('Cache-Control', 'no-store')
    const token = leerToken(req)
    if (token) {
        const { rows } = await pool.query(
            'SELECT u.id, u.email FROM sesiones s JOIN usuarios u ON u.id = s.usuario_id WHERE s.id = $1 AND u.id = $2 AND s.expira > now()',
            [token.jti, token.sub]
        )
        if (rows[0]) {
            req.usuario = rows[0]
            return next()
        }
    }
    res.status(401).json({ mensaje: 'Iniciá sesión para continuar.' })
}

const router = Router()
router.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
})

router.post('/login', origenValido, async (req, res) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : ''
    const clave = req.body?.clave
    if (!email || email.length > 254 || typeof clave !== 'string' || !clave || clave.length > 128) {
        return res.status(400).json({ mensaje: 'Completá el correo y la contraseña.' })
    }

    const ahora = Date.now()
    if (intentos.size >= 1000) {
        for (const [ip, estado] of intentos) if (estado.hasta <= ahora) intentos.delete(ip)
    }
    let estado = intentos.get(req.ip)
    if (!estado || estado.hasta <= ahora) {
        estado = { cantidad: 0, hasta: ahora + 10 * 60 * 1000 }
        if (intentos.size >= 1000 && !intentos.has(req.ip)) {
            return res.status(429).json({ mensaje: 'Probá de nuevo más tarde.' })
        }
        intentos.set(req.ip, estado)
    }
    if (estado.cantidad >= 8 || validacionesActivas >= 2) {
        return res.status(429).json({ mensaje: 'Demasiados intentos. Esperá antes de volver a ingresar.' })
    }

    estado.cantidad++
    validacionesActivas++
    let usuario
    try {
        const { rows } = await pool.query('SELECT id, email, clave_hash FROM usuarios WHERE email = $1', [email])
        if (!await verificarClave(clave, rows[0]?.clave_hash)) {
            return res.status(401).json({ mensaje: 'El correo o la contraseña son incorrectos.' })
        }
        usuario = rows[0]
    } finally {
        validacionesActivas--
    }

    intentos.delete(req.ip)
    const sesion = randomUUID()
    await pool.query('DELETE FROM sesiones WHERE expira <= now()')
    await pool.query('INSERT INTO sesiones (id, usuario_id, expira) VALUES ($1, $2, $3)',
        [sesion, usuario.id, new Date(Date.now() + vigencia * 1000)])
    res.cookie(nombreCookie, crearToken(usuario.id, sesion), { ...cookie, maxAge: vigencia * 1000 })
    res.json({ email: usuario.email })
})

router.get('/sesion', exigirSesion, (req, res) => res.json({ email: req.usuario.email }))

router.post('/logout', origenValido, async (req, res) => {
    const token = leerToken(req)
    if (token) await pool.query('DELETE FROM sesiones WHERE id = $1 AND usuario_id = $2', [token.jti, token.sub])
    res.clearCookie(nombreCookie, cookie)
    res.json({ mensaje: 'Sesión cerrada.' })
})

export default router
