/* --- 1. CONFIGURACIÓN INICIAL Y RELOJ --- */
function actualizarReloj() {
    const ahora = new Date();
    let horas = ahora.getHours();
    const minutos = ahora.getMinutes();
    const ampm = horas >= 12 ? 'PM' : 'AM';
    horas = horas % 12;
    horas = horas ? horas : 12;
    const minutosStr = minutos < 10 ? '0' + minutos : minutos;
    document.getElementById('reloj').textContent = `${horas}:${minutosStr} ${ampm}`;

    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    const diaNombre = diasSemana[ahora.getDay()];
    const diaNumero = ahora.getDate();
    const mesNombre = meses[ahora.getMonth()];
    const anio = ahora.getFullYear();

    document.getElementById('fecha').textContent = `${diaNombre} ${diaNumero} de ${mesNombre} de ${anio}`;
}
setInterval(actualizarReloj, 1000);
actualizarReloj();


/* --- 2. BASE DE DATOS SIMULADA (EN MEMORIA) --- */
// Guardaremos los registros así: "2025-11-24": { entrada: "10:00 AM", salida: "06:00 PM" }
const dbAsistencia = {}; 

let usuarioEstaAdentro = false;
let contadorEntradasVal = 0;
let contadorSalidasVal = 0;


/* --- 3. FUNCIONALIDAD DEL DASHBOARD (Principal) --- */

const btnEntradaMain = document.getElementById('btn-marcar-entrada');
const btnSalidaMain = document.getElementById('btn-marcar-salida');
const labelEntradas = document.getElementById('contador-entradas');
const labelSalidas = document.getElementById('contador-salidas');
const cuerpoTabla = document.getElementById('tabla-cuerpo');
const listaEntradasContainer = document.getElementById('lista-entradas-hoy');
const listaSalidasContainer = document.getElementById('lista-salidas-hoy');

// Funciones Auxiliares
function obtenerHoraFormateada() {
    const ahora = new Date();
    let horas = ahora.getHours();
    const minutos = ahora.getMinutes();
    const ampm = horas >= 12 ? 'PM' : 'AM';
    horas = horas % 12;
    horas = horas ? horas : 12;
    const minutosStr = minutos < 10 ? '0' + minutos : minutos;
    return `${horas}:${minutosStr} ${ampm}`;
}

function obtenerFechaKey() {
    // Retorna string único por día: "2025-11-24"
    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = ahora.getMonth() + 1;
    const dia = ahora.getDate();
    return `${anio}-${mes}-${dia}`;
}

function registrarAccion(tipo) {
    // Validaciones
    if (tipo === 'salida' && !usuarioEstaAdentro) {
        alert("⚠️ Error: No puedes marcar SALIDA sin haber marcado ENTRADA primero.");
        return;
    }
    if (tipo === 'entrada' && usuarioEstaAdentro) {
        alert("⚠️ Aviso: Ya estás adentro.");
        return;
    }

    const ahora = new Date();
    const horaActual = obtenerHoraFormateada();
    const fechaKey = obtenerFechaKey(); // "2025-11-24"

    // 1. Guardar en Base de Datos Simulada
    if (!dbAsistencia[fechaKey]) {
        dbAsistencia[fechaKey] = { entrada: '--:-- --', salida: '--:-- --' };
    }

    if (tipo === 'entrada') {
        dbAsistencia[fechaKey].entrada = horaActual;
        usuarioEstaAdentro = true;
        
        // Actualizar UI Dashboard
        contadorEntradasVal++;
        labelEntradas.textContent = contadorEntradasVal;
        agregarItemLista(listaEntradasContainer, horaActual);
        actualizarTablaSemanal(ahora.getDay(), 1, horaActual);

    } else {
        dbAsistencia[fechaKey].salida = horaActual;
        usuarioEstaAdentro = false;

        // Actualizar UI Dashboard
        contadorSalidasVal++;
        labelSalidas.textContent = contadorSalidasVal;
        agregarItemLista(listaSalidasContainer, horaActual);
        actualizarTablaSemanal(ahora.getDay(), 2, horaActual);
    }
}

function agregarItemLista(container, hora) {
    const div = document.createElement('div');
    div.classList.add('time-item');
    div.textContent = hora;
    container.appendChild(div);
}

function actualizarTablaSemanal(diaIndex, colIndex, texto) {
    const fila = cuerpoTabla.querySelector(`tr[data-dia="${diaIndex}"]`);
    if (fila) {
        const celda = fila.cells[colIndex];
        celda.textContent = texto;
        celda.style.color = colIndex === 1 ? "#2ecc71" : "#e74c3c";
        
        // Actualizar fecha en columna 3
        const celdaFecha = fila.cells[3];
        const hoy = new Date();
        celdaFecha.textContent = `${hoy.getDate()}/${hoy.getMonth()+1}/${hoy.getFullYear().toString().slice(-2)}`;
    }
}

btnEntradaMain.addEventListener('click', () => registrarAccion('entrada'));
btnSalidaMain.addEventListener('click', () => registrarAccion('salida'));


/* --- 4. NAVEGACIÓN Y VISTAS (Dashboard vs Historial) --- */

const vistaDashboard = document.getElementById('vista-dashboard');
const vistaHistorial = document.getElementById('vista-historial');
const btnVerAsistencias = document.getElementById('btn-ir-historial');
const btnVolverDashboard = document.getElementById('btn-volver-dashboard');

// Manejadores de eventos para los botones del menú lateral (NUEVO)
const btnMenuDash = document.getElementById('btn-menu-dashboard');
const btnMenuHist = document.getElementById('btn-menu-historial');

// Ir al Historial desde el menú lateral o el botón principal
function goToHistorial() {
    vistaDashboard.style.display = 'none';
    vistaHistorial.style.display = 'block';
    renderCalendar(); // Dibujar calendario al abrir
    
    // Actualizar estilo activo del menú lateral
    btnMenuHist.classList.add('active');
    btnMenuDash.classList.remove('active');
    
    // Cambiar iconos (estético)
    btnMenuHist.querySelector('i').className = 'fa-solid fa-chevron-right'; 
    btnMenuDash.querySelector('i').className = 'fa-solid fa-house'; 
}

// Volver al Dashboard desde el menú lateral o el botón de la vista historial
function goToDashboard() {
    vistaHistorial.style.display = 'none';
    vistaDashboard.style.display = 'block';
    
    // Actualizar estilo activo del menú lateral
    btnMenuHist.classList.remove('active');
    btnMenuDash.classList.add('active');
    
    // Cambiar iconos (estético)
    btnMenuDash.querySelector('i').className = 'fa-solid fa-chevron-right';
    btnMenuHist.querySelector('i').className = 'fa-solid fa-clock-rotate-left'; 
}

// Eventos de los botones principales del dashboard
btnVerAsistencias.addEventListener('click', goToHistorial);
btnVolverDashboard.addEventListener('click', goToDashboard);

// Eventos de los botones del menú lateral (NUEVO)
btnMenuHist.addEventListener('click', (e) => { e.preventDefault(); goToHistorial(); });
btnMenuDash.addEventListener('click', (e) => { e.preventDefault(); goToDashboard(); });


// Alternar entre Tabla y Detalles (Panel derecho del dashboard)
const vistaTabla = document.getElementById('vista-tabla');
const vistaDetalles = document.getElementById('vista-detalles');
document.getElementById('trigger-entradas').addEventListener('click', showDetalles);
document.getElementById('trigger-salidas').addEventListener('click', showDetalles);
document.getElementById('btn-regresar-tabla').addEventListener('click', () => {
    vistaDetalles.style.display = 'none';
    vistaTabla.style.display = 'block';
});

function showDetalles() {
    vistaTabla.style.display = 'none';
    vistaDetalles.style.display = 'flex';
}


/* --- 5. LÓGICA DEL CALENDARIO (Nuevo) --- */

const calendarGrid = document.getElementById('days-grid');
const monthLabel = document.getElementById('calendar-month-year');
const infoEntrada = document.getElementById('historial-entrada');
const infoSalida = document.getElementById('historial-salida');
const infoMsg = document.getElementById('historial-mensaje');

let currentMonth = new Date().getMonth(); // 0-11
let currentYear = new Date().getFullYear();

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

function renderCalendar() {
    calendarGrid.innerHTML = ""; // Limpiar
    monthLabel.textContent = monthNames[currentMonth];

    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // Día de la semana del 1ro (0=Dom, 1=Lun...)
    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate(); // Último día del mes
    
    // Ajuste para que Lunes sea el primer día de la grid (Si Dom es 0, lo hacemos 7)
    let startDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    // 1. Días vacíos previos (relleno gris oscuro como en la foto)
    for (let i = 0; i < startDay; i++) {
        const div = document.createElement('div');
        div.classList.add('day-circle', 'other-month');
        // Opcional: poner número del mes anterior
        div.textContent = ""; 
        calendarGrid.appendChild(div);
    }

    // 2. Días del mes actual
    for (let i = 1; i <= lastDay; i++) {
        const div = document.createElement('div');
        div.classList.add('day-circle');
        div.textContent = i;
        
        // Evento al hacer click en un día
        div.addEventListener('click', () => selectDay(i, div));

        calendarGrid.appendChild(div);
    }
}

function selectDay(day, element) {
    // 1. Visual: Quitar clase 'selected' a todos y ponerla al actual
    document.querySelectorAll('.day-circle').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');

    // 2. Lógica: Buscar en "Base de Datos"
    // Formato Key: "2025-11-25" (Ojo: Month es index 0, hay que sumar 1)
    const key = `${currentYear}-${currentMonth + 1}-${day}`;
    
    const data = dbAsistencia[key];

    if (data) {
        infoEntrada.textContent = data.entrada || "--:-- --";
        infoSalida.textContent = data.salida || "--:-- --";
        infoMsg.style.display = 'none';
        infoEntrada.parentElement.style.visibility = 'visible';
    } else {
        // No hay datos para ese día
        infoEntrada.textContent = "";
        infoSalida.textContent = "";
        infoMsg.textContent = "Sin registros";
        infoMsg.style.display = 'block';
        infoEntrada.parentElement.style.visibility = 'hidden';
    }
}

// Botones para cambiar mes (Opcional, pero útil)
document.getElementById('prev-month').addEventListener('click', () => {
    currentMonth--;
    if(currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar();
});
document.getElementById('next-month').addEventListener('click', () => {
    currentMonth++;
    if(currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
});
// --- NUEVO: LÓGICA DE MENÚ RESPONSIVO ---

const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menu-toggle');

menuToggle.addEventListener('click', () => {
    // Abre/cierra el menú
    sidebar.classList.toggle('open');
});


// Cierra el menú si se hace clic fuera de él o del botón de toggle
document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== menuToggle) {
        sidebar.classList.remove('open');
    }
});