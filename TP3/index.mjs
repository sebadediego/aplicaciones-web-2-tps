import express from 'express'

const app = express()
const puerto = 3000

app.use(express.static('./web'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/turnos', async (req, res) => {
    const respuesta = await fetch('https://6aadc5a0606bd915d1107c9f.mockapi.io/turnos')
    const turnos = await respuesta.json()

    res.json(turnos)
})

app.post('/api/turnos', async (req, res) => {
    const nuevoTurno = req.body

    const respuesta = await fetch('https://6aadc5a0606bd915d1107c9f.mockapi.io/turnos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoTurno)
    })

    const turnoCreado = await respuesta.json()

    res.json(turnoCreado)
})

app.listen(puerto, () => {
    console.log(`Servidor iniciado en http://localhost:${puerto}`)
})