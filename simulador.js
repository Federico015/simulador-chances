const cantidad = $("#cantidad-minutos");
const chancesDeGol = $("#chances-de-gol");
const $botonCalcular = document.querySelector('#boton-calcular');
$botonCalcular.addEventListener('click', manejarHoraClic);
const resultado = $("#resultado");
const dia = new Date();
let horaClic = manejarHoraClic()[0];
let minutoClic = manejarHoraClic()[1];
let cantidadGoles = 0;
console.log('Master: 11, Premium: 9, Normal: 7, Inferior: 5');
function tirarDado(){return Math.floor(Math.random() * 6) + 1};

for (let i = 1; i <= 15; i++){
    chancesDeGol.append(`<option>${i}</option>`);
}
for (let i = 15; i <= 360; i+=15){
    cantidad.append(`<option>${i}</option>`);
}

function procesarTiempo(){
    const cantidadChances = chancesDeGol.val();
    const minutosIngresados = Number(cantidad.val());
    const milisegundos = minutosIngresados * 60 * 1000;
    dia.setMinutes(dia.getMinutes() + minutosIngresados);
    const horaFinalizacion = dia;

    const textoHora = document.querySelector('#texto-hora');
    textoHora.textContent = `Hora de finalización: ${formatearHora(horaFinalizacion.getHours(), horaFinalizacion.getMinutes())}.
    Las ${cantidadChances} chances se simularán cada ${(minutosIngresados/cantidadChances).toFixed(2)} minutos a partir 
    de la hora actual (${formatearHora(horaClic, minutoClic)})`;

    return milisegundos;
}

function escribirChance(chance){
    let texto = '';
    if(chance === 1){
        cantidadGoles++;
        texto = '¡Gol!';
    }
    else{
        texto = 'Errado';
    }
    return texto;
}

function simularPartido(){
    cantidad.attr('disabled', '');
    chancesDeGol.attr('disabled', '');
    $botonCalcular.setAttribute('disabled', '');

    const resultadoFinal = document.querySelector("#resultado");
    const cantidadDeGoles = document.querySelector('#cantidad-goles');
    resultadoFinal.innerHTML = '';
    let tiempoDeJuego = procesarTiempo();
    let cantidadChances = chancesDeGol.val();
    let intervalo = tiempoDeJuego / cantidadChances;
    let horaClic = manejarHoraClic()[0];
    let minutoClic = manejarHoraClic()[1];

    for(let i = 1; i <= cantidadChances; i++){
        let horaChance = horaClic;
        let minutosChance = minutoClic;
        minutosChance += Math.floor(Number(cantidad.val()) / chancesDeGol.val() * i);

        while(minutosChance >= 60){
            horaChance ++;
            minutosChance -= 60;
        }
        if(horaChance >= 24){
            horaChance = 0;
        }

        const textoChance = document.createElement('p');
        textoChance.id = `chance-${i}`;
        textoChance.textContent = `${i}- ${formatearHora(horaChance, minutosChance)}`; 
        resultado.append(textoChance);
    }

    for(let i = 1; i <= cantidadChances; i++){
        setTimeout(() => {
            let chanceSimulada = tirarDado();
            const chanceConcretada = document.querySelector(`#chance-${i}`);
            chanceConcretada.textContent = `${i}- ${escribirChance(chanceSimulada)}`;
            cantidadDeGoles.textContent = `${cantidadGoles} goles`;
        }, i * intervalo);
    }
}

function manejarHoraClic(){
    const fecha = new Date();
    const hora = fecha.getHours();
    const minutos = fecha.getMinutes();
    return [hora, minutos];
}

$botonCalcular.onclick = function(){
    simularPartido();
    return false;
}

function formatearHora(hora, minutos){
    const horaFormateada = hora.toString().padStart(2, '0');
    const minutosFormateados = minutos.toString().padStart(2, '0');
    return `${horaFormateada}:${minutosFormateados}`;
}
