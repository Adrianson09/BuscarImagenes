// 

const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');
const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;


window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e){
    e.preventDefault();


    const terminoBusqueda = document.querySelector('#termino').value;

    if (terminoBusqueda === '') {
        mostrarAlerta('agrega un termino de busqueda');
        return;
    }
    buscarImagenes();
}

function mostrarAlerta(mensaje){
    const existeAlerta = document.querySelector('.bg-red-100');
    if (!existeAlerta) {
        
        const alerta = document.createElement('P');
        alerta.classList.add('bg-red-100','border-red-400','text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
    
        alerta.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline">${mensaje}</span>
        `;
    
        formulario.appendChild(alerta)
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }

}

function buscarImagenes(){
    const termino = document.querySelector('#termino').value;

    const key ='38238248-ae984a2fad41f6c4f55a7873f';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

    fetch(url)
    .then(respuesta => respuesta.json())
    .then(resultado => {
         totalPaginas = calcularPaginas(resultado.totalHits)
        mostrarImagenes(resultado.hits)
    })

}
// Generador de cantidad de elementos por pagina

function *crearPaginador(total){
    for (let i = 1; i <= total; i++) {
        yield i;
    }
}

function calcularPaginas(total){
    return parseInt( Math.ceil(total / registrosPorPagina ));
}

function mostrarImagenes(imagenes){
  
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
    // Iterar Imagenes y hacer HTML
    imagenes.forEach(imagen => {
        const { id, largeImageURL, previewURL} = imagen;

        resultado.innerHTML += `
        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4 ">
            <div class="bg-white">
                <img class="w-full" src="${previewURL}">
                <div class="p-4">
                    <a class="block w-full bg-blue-800 hover:bg-blue-700 text-white uppercase text-center font-bold rounded
                    mt-1 p-1" 
                    href="${largeImageURL}" 
                    target="_blank" rel="noopener noreferrer">
                    Ver Imagen
                    </a>
                </div>
            </div>
        </div>
        `
    });
    // limpiar el paginador previo
    while (paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild)
    }
    // generamos el HTML
    imprimirPaginador();
}

function imprimirPaginador(){
    iterador = crearPaginador(totalPaginas);
    while (true) {
        const {value, done} = iterador.next();
        if (done) return;

        // caso contrario, genera un btn por cada elemento
        const boton = document.createElement('A');
        boton.href ='#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguente', 'bg-yellow-400', 'px-4','py-1', 'mr-2', 'font-bold','mb-4', 'rounded' );

        boton.onclick = () =>{
            paginaActual = value
            buscarImagenes();
        }
        paginacionDiv.appendChild(boton);
    }

}