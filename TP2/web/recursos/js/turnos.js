const formulario = document.getElementById('form-turno')
const mensaje = document.getElementById('mensaje-turno')

formulario.addEventListener('submit', async (event) => {
    event.preventDefault()

    const nombre = document.getElementById('turno-nombre').value.trim()
    const telefono = document.getElementById('turno-telefono').value.trim()
    const fecha = document.getElementById('turno-fecha').value
    const hora = document.getElementById('turno-hora').value
    const profesional = document.getElementById('turno-profesional').value

    if (!nombre || !telefono || !fecha || !hora || !profesional) {
        mensaje.textContent = 'Completá todos los campos para solicitar el turno'
        return
    }

    const turno = {
        nombre,
        telefono,
        fecha,
        hora,
        profesional
    }

    const respuesta = await fetch('/api/turnos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(turno)
    })

    if (respuesta.ok) {
        mensaje.textContent = 'Turno solicitado correctamente'
        formulario.reset()
    } else {
        mensaje.textContent = 'No se pudo registrar el turno'
    }
})