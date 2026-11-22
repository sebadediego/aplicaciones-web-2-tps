const formulario = document.getElementById('form-turno')
const mensaje = document.getElementById('mensaje-turno')
mensaje.setAttribute('role', 'status')

formulario.addEventListener('submit', async event => {
    event.preventDefault()
    const turno = {}
    for (const campo of ['nombre', 'telefono', 'fecha', 'hora', 'profesional']) {
        turno[campo] = document.getElementById('turno-' + campo).value.trim()
    }

    const boton = formulario.querySelector('[type=submit]')
    boton.disabled = true
    mensaje.textContent = 'Enviando solicitud…'
    try {
        const respuesta = await fetch('/api/turnos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(turno)
        })
        const datos = await respuesta.json()
        if (!respuesta.ok) {
            mensaje.textContent = datos.mensaje || 'No se pudo registrar el turno.'
            return
        }
        mensaje.textContent = 'Solicitud enviada. El consultorio podrá confirmar el turno.'
        formulario.reset()
    } catch {
        mensaje.textContent = 'No pudimos conectar con el servidor. Intentá nuevamente.'
    } finally {
        boton.disabled = false
    }
})
