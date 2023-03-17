// VARIABLES
const selectCriptos = document.querySelector('#criptomonedas');
const selectMoneda = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();
    
    formulario.addEventListener('submit', submitFormulario);

    selectCriptos.addEventListener('change', leerValor);
    selectMoneda.addEventListener('change', leerValor);
});

// FUNCIONES
function consultarCriptomonedas() {
    const url = `https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=USD`;
    
    fetch(url)
    .then(respuesta     => respuesta.json())
    .then(resultado     => obtenerCriptomonedas(resultado.Data))
    .then(criptomonedas => selectCriptomonedas(criptomonedas));
}

const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
});

function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(cripto => {
        const { FullName, Name } = cripto.CoinInfo;
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        selectCriptos.appendChild(option);
    });
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
    console.log(objBusqueda);
}

function submitFormulario(e) {
    e.preventDefault();

    const { moneda, criptomoneda } = objBusqueda;
    if (moneda === '' || criptomoneda === ''){ 
        mostrarAlerta('Todos los campos son obligatorios');
        return;
    }

    // Consultar la API con los resultados
    consultarAPI();
}

function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    fetch(url)
    .then(respuesta => respuesta.json())
    .then(cotizacion => {
        mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
    });
}

function mostrarCotizacionHTML(cotizacion) {
    
    limpiarHTML();

    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `Precio: <span>${PRICE}</span>`;

    const precioMax = document.createElement('p');
    precioMax.innerHTML = `Máx. diario: <span>${HIGHDAY}</span>`;

    const precioMin = document.createElement('p');
    precioMin.innerHTML = `Mín. diario: <span>${LOWDAY}</span>`;

    const variacion = document.createElement('p');
    variacion.innerHTML = `Últ. 24HS: <span>${CHANGEPCT24HOUR}%</span>`;

    const actualizado = document.createElement('p');
    actualizado.innerHTML = `Actualizado: <span>${LASTUPDATE}</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioMin);
    resultado.appendChild(precioMax);
    resultado.appendChild(variacion);
    resultado.appendChild(actualizado);

}

function mostrarAlerta(mensaje) {
    const existeAlerta = document.querySelector('.error');

    if (!existeAlerta) {

        const div = document.createElement('div');
        div.classList.add('error');
        div.textContent = mensaje;
        formulario.appendChild(div);

        setTimeout(() => {
            div.remove();
        }, 3000);
    }
    
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner() {
    limpiarHTML();
    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;
    resultado.appendChild(spinner);
}