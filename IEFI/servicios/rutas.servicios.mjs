import { Router } from 'express'
import { exigirSesion, origenValido } from '../auth/rutas.auth.mjs'
import * as controlador from './controlador.servicios.mjs'

const router = Router()
router.get('/', controlador.listar)
router.get('/:id', controlador.buscar)
router.post('/', origenValido, exigirSesion, controlador.agregar)
router.put('/:id', origenValido, exigirSesion, controlador.modificar)
router.delete('/:id', origenValido, exigirSesion, controlador.eliminar)

export default router
