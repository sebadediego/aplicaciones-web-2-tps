import { Router } from 'express'
import * as controlador from './controlador.servicios.mjs'

const router = Router()

router.get('/', controlador.listar)
router.get('/:id', controlador.buscar)
router.post('/', controlador.agregar)
router.put('/:id', controlador.modificar)
router.delete('/:id', controlador.eliminar)

export default router
