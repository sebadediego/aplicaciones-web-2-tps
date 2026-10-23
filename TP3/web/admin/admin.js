// Panel de servicios conectado al CRUD de PostgreSQL.
let servicios = []
let editando = null

const $ = id => document.getElementById(id)

async function pedirAPI(ruta = '', opciones = {}) {
    const respuesta = await fetch('/api/servicios' + ruta, {
        ...opciones,
        headers: { 'Content-Type': 'application/json', ...opciones.headers }
    })
    const datos = await respuesta.json()
    if (!respuesta.ok) throw new Error(datos.mensaje || 'Error de comunicación con el servidor.')
    return datos
}

async function cargar() {
    try {
        servicios = await pedirAPI()
        $('aviso').textContent = ''
        $('aviso').hidden = true
        renderizar()
    } catch (error) {
        $('aviso').hidden = false
        $('aviso').textContent = error.message + ' Revisá la conexión con PostgreSQL.'
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
    if (!servicio || !confirm('¿Eliminar el servicio "' + servicio.nombre + '"?')) return
    try {
        await pedirAPI('/' + id, { method: 'DELETE' })
        await cargar()
    } catch (error) {
        alert(error.message)
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
    } catch (error) {
        $('error').textContent = error.message
    } finally {
        boton.disabled = false
    }
})

cargar()
