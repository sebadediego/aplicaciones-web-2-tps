import { createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const derivar = promisify(scrypt)
const opciones = { N: 2 ** 17, r: 8, p: 1, maxmem: 160 * 1024 ** 2 }
const salDeComparacion = Buffer.alloc(16)
const emisor = 'kinesio-saludd'
const audiencia = 'panel-administrativo'
export const vigencia = 30 * 60

export async function hashClave(clave) {
    const sal = randomBytes(16)
    const hash = await derivar(clave, sal, 64, opciones)
    return sal.toString('hex') + ':' + hash.toString('hex')
}

export async function verificarClave(clave, guardado) {
    const [sal, hash] = (guardado || '').split(':')
    const esperado = hash ? Buffer.from(hash, 'hex') : Buffer.alloc(64)
    const calculado = await derivar(clave, sal ? Buffer.from(sal, 'hex') : salDeComparacion, 64, opciones)
    return timingSafeEqual(esperado, calculado) && Boolean(guardado)
}

function firmar(datos) {
    return createHmac('sha256', Buffer.from(process.env.JWT_SECRET, 'hex')).update(datos).digest()
}

const cabecera = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')

export function crearToken(usuarioId, sesion) {
    const iat = Math.floor(Date.now() / 1000)
    const carga = Buffer.from(JSON.stringify({
        iss: emisor, aud: audiencia, sub: String(usuarioId), jti: sesion, iat, exp: iat + vigencia
    })).toString('base64url')
    const datos = cabecera + '.' + carga
    return datos + '.' + firmar(datos).toString('base64url')
}

export function verificarToken(token) {
    if (!token || token.length > 1024) return null
    const partes = token.split('.')
    if (partes.length !== 3 || partes[0] !== cabecera ||
        !/^[A-Za-z0-9_-]+$/.test(partes[1]) || !/^[A-Za-z0-9_-]{43}$/.test(partes[2])) return null

    const firma = Buffer.from(partes[2], 'base64url')
    if (firma.toString('base64url') !== partes[2] ||
        !timingSafeEqual(firma, firmar(partes[0] + '.' + partes[1]))) return null

    try {
        const datos = JSON.parse(Buffer.from(partes[1], 'base64url').toString('utf8'))
        const ahora = Math.floor(Date.now() / 1000)
        if (datos.iss !== emisor || datos.aud !== audiencia ||
            !/^[1-9]\d{0,9}$/.test(datos.sub) || Number(datos.sub) > 2147483647 ||
            !/^[0-9a-f-]{36}$/.test(datos.jti) || !Number.isInteger(datos.iat) ||
            datos.iat > ahora || datos.exp !== datos.iat + vigencia || datos.exp <= ahora) return null
        return datos
    } catch {
        return null
    }
}
