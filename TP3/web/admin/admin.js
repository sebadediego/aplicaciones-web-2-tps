// TP3 - Punto 3.3: interfaz administrativa. Persistencia local provisoria.
// En la entrega final se reemplazará por llamadas a la API de servicios.
const CLAVE = 'kinesio-saludd-servicios-tp3';
const iniciales = [
  { id:'1',nombre:'Kinesiología',descripcion:'Evaluación y tratamiento de lesiones musculares y articulares.',activo:true },
  { id:'2',nombre:'Masoterapia',descripcion:'Técnicas manuales para aliviar tensiones y mejorar el bienestar.',activo:true },
  { id:'3',nombre:'Osteopatía',descripcion:'Abordaje manual de la movilidad y la función corporal.',activo:true },
  { id:'4',nombre:'Rehabilitación',descripcion:'Acompañamiento en procesos de recuperación funcional.',activo:true },
  { id:'5',nombre:'Punción seca',descripcion:'Tratamiento de puntos gatillo mediante técnica de punción.',activo:true },
  { id:'6',nombre:'Kinesiología respiratoria',descripcion:'Técnicas destinadas al cuidado de la función respiratoria.',activo:true }
];
function leer(){try{const guardados=JSON.parse(localStorage.getItem(CLAVE));return Array.isArray(guardados)?guardados:iniciales.map(x=>({...x}));}catch{return iniciales.map(x=>({...x}));}}
let servicios=leer(),editando=null;
const $=id=>document.getElementById(id);
function guardar(){localStorage.setItem(CLAVE,JSON.stringify(servicios));renderizar();}
function renderizar(){
  const busqueda=$('buscar').value.trim().toLocaleLowerCase('es');
  const visibles=servicios.filter(s=>s.nombre.toLocaleLowerCase('es').includes(busqueda));
  $('filas').replaceChildren();
  for(const servicio of visibles){
    const tr=document.createElement('tr');
    for(const valor of [servicio.nombre,servicio.descripcion]){
      const td=document.createElement('td');td.textContent=valor;tr.append(td);
    }
    const estado=document.createElement('td'),insignia=document.createElement('span');
    insignia.className='estado'+(servicio.activo?'':' inactivo');insignia.textContent=servicio.activo?'Activo':'Inactivo';estado.append(insignia);tr.append(estado);
    const acciones=document.createElement('td');
    for(const [texto,clase,accion] of [['Editar','mini',()=>abrir(servicio.id)],['Eliminar','mini peligro',()=>eliminar(servicio.id)]]){
      const boton=document.createElement('button');boton.textContent=texto;boton.className=clase;boton.type='button';boton.addEventListener('click',accion);acciones.append(boton);
    }
    tr.append(acciones);$('filas').append(tr);
  }
  $('vacio').hidden=visibles.length!==0;$('total').textContent=servicios.length;
  $('activos').textContent=servicios.filter(s=>s.activo).length;
}
function abrir(id=null){
  editando=id;const actual=servicios.find(s=>s.id===id);
  $('formulario').reset();$('error').textContent='';
  $('titulo-formulario').textContent=actual?'Editar servicio':'Nuevo servicio';
  $('nombre').value=actual?.nombre??'';$('descripcion').value=actual?.descripcion??'';
  $('activo').checked=actual?.activo??true;$('dialogo').showModal();$('nombre').focus();
}
function eliminar(id){
  const servicio=servicios.find(s=>s.id===id);
  if(servicio && confirm('¿Eliminar el servicio "'+servicio.nombre+'"?')){
    servicios=servicios.filter(s=>s.id!==id);guardar();
  }
}
$('nuevo').addEventListener('click',()=>abrir());
$('cancelar').addEventListener('click',()=>$('dialogo').close());
$('buscar').addEventListener('input',renderizar);
$('formulario').addEventListener('submit',e=>{
  e.preventDefault();const nombre=$('nombre').value.trim(),descripcion=$('descripcion').value.trim();
  if(!nombre||!descripcion){$('error').textContent='Completá el nombre y la descripción.';return;}
  const datos={nombre,descripcion,activo:$('activo').checked};
  if(editando){servicios=servicios.map(s=>s.id===editando?{...s,...datos}:s);}
  else{servicios.push({id:globalThis.crypto?.randomUUID?.()??String(Date.now()),...datos});}
  guardar();$('dialogo').close();
});
renderizar();