import { readFile } from 'node:fs/promises'
import pg from 'pg'
import { pool } from './conexion.mjs'
import { hashClave } from '../auth/seguridad.mjs'

const nombre = process.env.DB_NAME || 'kinesio_saludd'
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
const clave = process.env.ADMIN_PASSWORD || ''

async function crearBase() {
    const mantenimiento = new pg.Client({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_MAINTENANCE || 'postgres',
        connectionTimeoutMillis: 5000
    })
    await mantenimiento.connect()
    try {
        await mantenimiento.query('CREATE DATABASE "' + nombre + '"')
    } catch (error) {
        if (error.code !== '42P04') throw error
    } finally {
        await mantenimiento.end()
    }
}

async function preparar() {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]{0,62}$/.test(nombre)) throw new Error('DB_NAME debe ser un identificador PostgreSQL simple.')
    if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        clave.length < 12 || clave.length > 128 || clave === 'REEMPLAZAR_CON_TU_CLAVE') {
        throw new Error('Configurá ADMIN_EMAIL y una ADMIN_PASSWORD propia de 12 a 128 caracteres.')
    }

    let conexion
    try {
        conexion = await pool.connect()
    } catch (error) {
        if (error.code !== '3D000') throw error
        await crearBase()
        conexion = await pool.connect()
    }

    try {
        const estructura = await readFile(new URL('./estructura.sql', import.meta.url), 'utf8')
        const servicios = await readFile(new URL('./servicios.sql', import.meta.url), 'utf8')
        await conexion.query('BEGIN')
        await conexion.query("SELECT pg_advisory_xact_lock(3182604)")
        await conexion.query(estructura)
        await conexion.query(servicios)
        const existente = await conexion.query('SELECT id FROM usuarios WHERE email = $1', [email])
        if (!existente.rowCount) {
            await conexion.query('INSERT INTO usuarios (email, clave_hash) VALUES ($1, $2)', [email, await hashClave(clave)])
        }
        await conexion.query('COMMIT')
        console.log('Base preparada. Podés iniciar sesión con la cuenta configurada.')
    } catch (error) {
        await conexion.query('ROLLBACK')
        throw error
    } finally {
        conexion.release()
    }
}

try {
    await preparar()
} catch (error) {
    console.error('No se pudo preparar la base:', error.message)
    process.exitCode = 1
} finally {
    await pool.end()
}
