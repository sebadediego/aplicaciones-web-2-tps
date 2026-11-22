// Panel de servicios conectado al CRUD de PostgreSQL.
let servicios = []
let editando = null

const $ = id => document.getElementById(id)

async function pedir(ruta, opciones = {}) {
    const respuesta = await fetch(ruta, {
        ...opciones,
        headers: { 'Content-Type': 'application/json', ...opciones.headers }
    })
    const datos = await respuesta.json()
    if (!respuesta.ok) {
        const error = new Error(datos.mensaje || 'Error de comunicación con el servidor.')
        error.estado = respuesta.status
        throw error
    }
    return datos
}

async function pedirAPI(ruta = '', opciones) {
    try {
        return await pedir('/api/servicios' + ruta, opciones)
    } catch (error) {
        if (error.estado === 401) mostrarAcceso('Tu sesión terminó. Volvé a ingresar.')
        throw error
    }
}

function mostrarAviso(mensaje) {
    $('aviso').textContent = mensaje
    $('aviso').hidden = !mensaje
}

function mostrarAcceso(mensaje = '') {
    for (const id of ['dialogo', 'confirmar-eliminacion']) {
        if ($(id).open) $(id).close()
    }
    servicios = []
    $('filas').replaceChildren()
    $('cargando').hidden = true
    $('panel-admin').hidden = true
    $('acceso').hidden = false
    $('mensaje-login').textContent = mensaje
    $('email').focus()
}

async function mostrarPanel(usuario) {
    $('cargando').hidden = true
    $('acceso').hidden = true
    $('panel-admin').hidden = false
    $('cuenta').textContent = usuario.email
    await cargar()
}

async function cargar() {
    try {
        servicios = await pedirAPI()
        mostrarAviso('')
        renderizar()
    } catch (error) {
        mostrarAviso(error.message)
    }
}

function renderizar() {
    const busqueda = $('buscar').value.trim().toLocaleLowerCase('es')
    const visibles = servicios.filter(s => s.nombre.toLocaleLowerCase('es').includes(busqueda))
    $('filas').replaceChildren()
    for (const servicio of visibles) {
        const tr = document.createElement('tr')
        for (const valor of [servicio.nombre, servicio.descripcion]) {
            const td = document.createElement('td')
            td.textContent = valor
            tr.append(td)
        }
        const estado = document.createElement('td')
        const insignia = document.createElement('span')
        insignia.className = 'estado' + (servicio.activo ? '' : ' inactivo')
        insignia.textContent = servicio.activo ? 'Activo' : 'Inactivo'
        estado.append(insignia)
        tr.append(estado)
        const acciones = document.createElement('td')
        for (const [texto, clase, accion] of [
            ['Editar', 'mini', () => abrir(servicio.id)],
            ['Eliminar', 'mini peligro', () => eliminar(servicio.id)]
        ]) {
            const boton = document.createElement('button')
            boton.textContent = texto
            boton.className = clase
            boton.type = 'button'
            boton.addEventListener('click', accion)
            acciones.append(boton)
        }
        tr.append(acciones)
        $('filas').append(tr)
    }
    $('vacio').hidden = visibles.length !== 0
    $('total').textContent = servicios.length
    $('activos').textContent = servicios.filter(s => s.activo).length
}

function abrir(id = null) {
    editando = id
    const actual = servicios.find(s => s.id === id)
    $('formulario').reset()
    $('error').textContent = ''
    $('titulo-formulario').textContent = actual ? 'Editar servicio' : 'Nuevo servicio'
    $('nombre').value = actual?.nombre ?? ''
    $('descripcion').value = actual?.descripcion ?? ''
    $('activo').checked = actual?.activo ?? true
    $('dialogo').showModal()
    $('nombre').focus()
}

async function eliminar(id) {
    const servicio = servicios.find(s => s.id === id)
    if (!servicio) return
    const confirmacion = $('confirmar-eliminacion')
    $('servicio-a-eliminar').textContent = '¿Eliminar «' + servicio.nombre + '»?'
    confirmacion.returnValue = ''
    confirmacion.showModal()
    await new Promise(resolve => confirmacion.addEventListener('close', resolve, { once: true }))
    if (confirmacion.returnValue !== 'eliminar') return
    try {
        await pedirAPI('/' + id, { method: 'DELETE' })
        await cargar()
        mostrarAviso('Servicio eliminado.')
    } catch (error) {
        mostrarAviso(error.message)
    }
}

$('nuevo').addEventListener('click', () => abrir())
$('cancelar').addEventListener('click', () => $('dialogo').close())
$('buscar').addEventListener('input', renderizar)

$('formulario').addEventListener('submit', async e => {
    e.preventDefault()
    const nombre = $('nombre').value.trim()
    const descripcion = $('descripcion').value.trim()
    if (!nombre || !descripcion) {
        $('error').textContent = 'Completá el nombre y la descripción.'
        return
    }
    const datos = { nombre, descripcion, activo: $('activo').checked }
    const boton = $('formulario').querySelector('[type=submit]')
    boton.disabled = true
    $('error').textContent = ''
    try {
        await pedirAPI(editando === null ? '' : '/' + editando, {
            method: editando === null ? 'POST' : 'PUT',
            body: JSON.stringify(datos)
        })
        $('dialogo').close()
        await cargar()
        mostrarAviso('Servicio guardado.')
    } catch (error) {
        $('error').textContent = error.message
    } finally {
        boton.disabled = false
    }
})

$('form-login').addEventListener('submit', async event => {
    event.preventDefault()
    const boton = event.submitter
    boton.disabled = true
    $('mensaje-login').textContent = 'Ingresando…'
    try {
        const usuario = await pedir('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: $('email').value, clave: $('clave').value })
        })
        $('form-login').reset()
        await mostrarPanel(usuario)
    } catch (error) {
        $('mensaje-login').textContent = error.message
    } finally {
        boton.disabled = false
    }
})

$('salir').addEventListener('click', async () => {
    const boton = $('salir')
    boton.disabled = true
    try {
        await pedir('/api/auth/logout', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}'
        })
        mostrarAcceso('Sesión cerrada.')
    } catch (error) {
        mostrarAviso(error.message)
    } finally {
        boton.disabled = false
    }
})

try {
    await mostrarPanel(await pedir('/api/auth/sesion'))
} catch (error) {
    mostrarAcceso(error.estado === 401 ? '' : error.message)
}
