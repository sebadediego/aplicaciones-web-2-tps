// Consulta pública de servicios activos.
const contenedor = document.getElementById('listado-servicios')

const imagenes = [
  ['kinesiolog', 'kinesiologia.jpeg'],
  ['traumatol', 'rehabilitacion.jpeg'],
  ['respirator', 'respiratoria.jpeg'],
  ['masoterap', 'masoterapia.jpeg'],
  ['osteopat', 'osteopatia.jpeg'],
  ['punci', 'puncion-seca.jpeg']
]

function tarjeta(servicio) {
  const articulo = document.createElement('article')
  articulo.className = 'tarjeta-servicio'
  const coincidencia = imagenes.find(([clave]) => servicio.nombre.toLowerCase().includes(clave))
  if (coincidencia) {
    const imagen = document.createElement('img')
    imagen.src = 'recursos/imagenes/' + coincidencia[1]
    imagen.alt = servicio.nombre
    articulo.append(imagen)
  }
  const cuerpo = document.createElement('div')
  cuerpo.className = 'contenido-tarjeta'
  const titulo = document.createElement('h2')
  titulo.textContent = servicio.nombre
  const descripcion = document.createElement('p')
  descripcion.textContent = servicio.descripcion
  cuerpo.append(titulo, descripcion)
  articulo.append(cuerpo)
  return articulo
}

async function cargarServicios() {
  try {
    const respuesta = await fetch('/api/servicios')
    if (!respuesta.ok) throw new Error('Error del servidor')
    const servicios = await respuesta.json()
    const activos = servicios.filter(servicio => servicio.activo)
    contenedor.replaceChildren()
    for (const servicio of activos) contenedor.append(tarjeta(servicio))
    if (!activos.length) contenedor.textContent = 'Por el momento no hay servicios publicados.'
  } catch {
    contenedor.textContent = 'No pudimos cargar los servicios. Intentá nuevamente más tarde.'
  }
}

cargarServicios()
