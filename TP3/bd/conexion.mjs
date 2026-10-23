import pg from 'pg'

const { Pool } = pg

// Las credenciales se leen de variables de entorno, nunca desde GitHub.
export const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'kinesio_saludd'
})
