import * as modelo from './modelo.servicios.mjs'

function idValido(req, res) {
    const id = Number(req.params.id)
    if (!Number.isSafeInteger(id) || id <= 0) {
        res.status(400).json({ mensaje: 'ID inválido' })
        return null
    }
    return id
}

function datosValidos(req, res) {
    const { nombre, descripcion, activo } = req.body || {}
    if (typeof nombre !== 'string' || !nombre.trim() || nombre.trim().length > 70 ||
        typeof descripcion !== 'string' || !descripcion.trim() || descripcion.trim().length > 250 ||
        typeof activo !== 'boolean') {
        res.status(400).json({ mensaje: 'Completá correctamente nombre, descripción y estado.' })
        return null
    }
    return { nombre: nombre.trim(), descripcion: descripcion.trim(), activo }
}

export async function listar(req, res) {
    try {
        const servicios = await modelo.listar()
        res.json(servicios)
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensaje: 'No se pudieron consultar los servicios.' })
    }
}

export async function buscar(req, res) {
    const id = idValido(req, res)
    if (id === null) return
    try {
        const servicio = await modelo.buscar(id)
        if (!servicio) return res.status(404).json({ mensaje: 'Servicio no encontrado.' })
        res.json(servicio)
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensaje: 'No se pudo consultar el servicio.' })
    }
}

export async function agregar(req, res) {
    const datos = datosValidos(req, res)
    if (!datos) return
    try {
        const servicio = await modelo.agregar(datos)
        res.status(201).json(servicio)
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensaje: 'No se pudo agregar el servicio.' })
    }
}

export async function modificar(req, res) {
    const id = idValido(req, res)
    if (id === null) return
    const datos = datosValidos(req, res)
    if (!datos) return
    try {
        const servicio = await modelo.modificar(id, datos)
        if (!servicio) return res.status(404).json({ mensaje: 'Servicio no encontrado.' })
        res.json(servicio)
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensaje: 'No se pudo modificar el servicio.' })
    }
}

export async function eliminar(req, res) {
    const id = idValido(req, res)
    if (id === null) return
    try {
        const servicio = await modelo.eliminar(id)
        if (!servicio) return res.status(404).json({ mensaje: 'Servicio no encontrado.' })
        res.json({ mensaje: 'Servicio eliminado.', servicio })
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensaje: 'No se pudo eliminar el servicio.' })
    }
}
