let indice = 0;
let puntaje = 0;
let tiempo = 300;
let intervalo_temporizador;
let preguntas_seleccionadas = [];
let nombreUsuario = "";

const input_nombre = document.getElementById('nombreUsuario');
const btnIniciar = document.getElementById('btnIniciar');
const btnEnviar = document.getElementById('btnEnviar');
const btnReintentar = document.getElementById('btnReintentar');
const btnMenu = document.getElementById('btnMenu');
const btnVerRanking = document.getElementById('btnVerRanking');
const div_ranking = document.getElementById('ranking');

input_nombre.addEventListener('input', () => {
    btnIniciar.disabled = input_nombre.value.trim() === "";
});

btnIniciar.addEventListener('click', () => {
    nombreUsuario = input_nombre.value.trim();
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('quiz').classList.remove('hidden');
    puntaje = 0;
    indice = 0;
    preguntas_seleccionadas = preguntas.sort(() => 0.5 - Math.random()).slice(0, 10);
    mostrarPregunta();
    iniciarTemporizador();
});

btnEnviar.addEventListener('click', () => {
    if (seleccion === null) return;
    const correcta = preguntas_seleccionadas[indice].respuesta;
    const opciones = document.querySelectorAll('.option');
    opciones.forEach((opt, i) => {
        if (i === correcta) opt.classList.add('correct');
        else if (i === seleccion) opt.classList.add('incorrect');
    });
    if (seleccion === correcta) puntaje++;
    seleccion = null;
    indice++;
    setTimeout(() => {
        if (indice < 10) {
            mostrarPregunta();
        } else {
            terminarQuiz();
        }
    }, 1000);
});

btnReintentar.addEventListener('click', () => {
    location.reload();
});

btnMenu.addEventListener('click', () => {
    location.reload();
});




let seleccion = null;

function seleccionarOpcion(elemento, indice) {
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    elemento.classList.add('selected');
    seleccion = indice;
}

function iniciarTemporizador() {
    intervalo_temporizador = setInterval(() => {
        tiempo--;
        const min = Math.floor(tiempo / 60);
        const seg = tiempo % 60;
        document.getElementById('temporizador').textContent = `${min}:${seg < 10 ? '0' + seg : seg}`;
        if (tiempo <= 0) {
            clearInterval(intervalo_temporizador);
            terminarQuiz();
        }
    }, 1000);
}

function terminarQuiz() {
    clearInterval(intervalo_temporizador);
    const tiempoTotal = 300 - tiempo;
    document.getElementById('quiz').classList.add('hidden');
    document.getElementById('resultados').classList.remove('hidden');
    const porcentaje = Math.round((puntaje / 10) * 100);
    document.getElementById('puntaje').textContent = `${nombreUsuario}, obtuviste ${puntaje}/10 (${porcentaje}%) en ${tiempoTotal} segundos`;

    const datos = JSON.parse(localStorage.getItem('rankingMatematicas')) || [];
    datos.push({ nombre: nombreUsuario, puntaje, tiempo: tiempoTotal, fecha: new Date().toLocaleDateString() });
    localStorage.setItem('rankingMatematicas', JSON.stringify(datos));
}

btnVerRanking.addEventListener('click', () => {
    const datos = JSON.parse(localStorage.getItem('rankingMatematicas')) || [];
    datos.sort((a, b) => b.puntaje - a.puntaje || a.tiempo - b.tiempo);
    div_ranking.innerHTML = "<h3>Top 5 Puntajes:</h3>";
    const top = datos.slice(0, 5);
    top.forEach((r, i) => {
        div_ranking.innerHTML += `<p>${i + 1}. ${r.nombre}: ${r.puntaje} puntos, ${r.tiempo} segundos</p>`;
    });
    div_ranking.classList.remove('hidden');
});

function mostrarPregunta() {
    const div_pregunta = document.getElementById('divPregunta');
    div_pregunta.innerHTML = "";
    const pregunta = preguntas_seleccionadas[indice];

    const elemento_pregunta = document.createElement('h3');
    elemento_pregunta.textContent = `Pregunta ${indice + 1} de ${preguntas_seleccionadas.length}: ${pregunta.pregunta}`;
    div_pregunta.appendChild(elemento_pregunta);

    pregunta.opciones.forEach((opcion, indice) => {
        const btn = document.createElement('div');
        btn.classList.add('option');
        btn.textContent = opcion;
        btn.addEventListener('click', () => seleccionarOpcion(btn, indice));
        div_pregunta.appendChild(btn);
    });
}
