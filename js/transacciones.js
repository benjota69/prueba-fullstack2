// Módulo de Transacciones 
// Este archivo maneja las transacciones (ingresos, gastos y compras)

// Cuando la página se carga, ejecutar estas funciones
document.addEventListener('DOMContentLoaded', function() {
    createSampleData();             // Crear datos de ejemplo si no existen
    cargarTodasLasTransacciones();  // Cargar transacciones existentes
    configurarFormulario();         // Configurar el formulario
    ponerFechaDeHoy();              // Poner fecha de hoy por defecto
    configurarFiltros();            // Configurar filtros
});

// Configurar formulario
function configurarFormulario() {
    const formulario = document.getElementById('transactionForm');
    const selectorDeTipo = document.getElementById('transactionType');
    
    if (formulario) {
        formulario.addEventListener('submit', guardarTransaccion);
    }
    
    if (selectorDeTipo) {
        selectorDeTipo.addEventListener('change', mostrarCamposDeTarjeta);
    }
}

// Poner fecha de hoy
function ponerFechaDeHoy() {
    const campoFecha = document.getElementById('transactionDate');
    if (campoFecha) {
        campoFecha.value = new Date().toISOString().split('T')[0];
    }
}

// Mostrar u ocultar campos según el tipo de transacción
function mostrarCamposDeTarjeta() {
    const queTipo = document.getElementById('transactionType').value;
    const grupoTarjetas = document.getElementById('cardSelectionGroup');
    const grupoComercios = document.getElementById('commerceGroup');
    
    // Si es una compra, mostrar campos de tarjeta y comercio
    if (queTipo === 'compra') {
        grupoTarjetas.style.display = 'block';
        grupoComercios.style.display = 'block';
        cargarTarjetas();  // Cargar las tarjetas disponibles
    } else {
        // Para ingresos y gastos, ocultar estos campos
        grupoTarjetas.style.display = 'none';
        grupoComercios.style.display = 'none';
    }
}

// Cargar las tarjetas registradas en el selector
function cargarTarjetas() {
    const selectorDeTarjetas = document.getElementById('transactionCard');
    if (!selectorDeTarjetas) return;
    
    try {
        // Obtener tarjetas guardadas en el navegador
        const tarjetasGuardadas = JSON.parse(localStorage.getItem('registered_cards') || '[]');
        selectorDeTarjetas.innerHTML = '<option value="">Seleccionar tarjeta</option>';
        
        // Crear opciones para cada tarjeta (mostrando solo últimos 4 dígitos)
        tarjetasGuardadas.forEach(unaTarjeta => {
            const nuevaOpcion = document.createElement('option');
            nuevaOpcion.value = unaTarjeta.id;
            nuevaOpcion.textContent = `${unaTarjeta.alias} (••••${unaTarjeta.number.slice(-4)})`;
            selectorDeTarjetas.appendChild(nuevaOpcion);
        });
    } catch (error) {
        console.error('Error al cargar tarjetas:', error);
    }
}

// Guardar una nueva transacción
function guardarTransaccion(evento) {
    evento.preventDefault();
    
    // Obtener todos los datos del formulario
    const datosDelFormulario = {
        type: document.getElementById('transactionType').value,
        amount: parseFloat(document.getElementById('transactionAmount').value),
        category: document.getElementById('transactionCategory').value,
        description: document.getElementById('transactionDescription').value,
        date: document.getElementById('transactionDate').value,
        cardId: document.getElementById('transactionCard').value,
        commerceName: document.getElementById('commerceName').value
    };
    
    // Validar que todos los datos sean correctos
    if (!validarTransaccion(datosDelFormulario)) {
        return;
    }
    
    // Crear el objeto de la transacción
    const nuevaTransaccion = {
        id: Date.now(),  // ID único
        ...datosDelFormulario,
        createdAt: new Date().toISOString()
    };
    
    // Guardar en el navegador
    guardarEnElNavegador(nuevaTransaccion);
    
    // Limpiar el formulario y recargar la lista
    document.getElementById('transactionForm').reset();
    ponerFechaDeHoy();
    mostrarCamposDeTarjeta();
    cargarTodasLasTransacciones();
    
    alert('Transacción guardada exitosamente!');
}

// Validar transacción
function validarTransaccion(datosParaValidar) {
    if (!datosParaValidar.type) {
        alert('Selecciona el tipo de transacción');
        return false;
    }
    
    if (!datosParaValidar.amount || datosParaValidar.amount <= 0) {
        alert('El monto debe ser mayor a 0');
        return false;
    }
    
    if (!datosParaValidar.category) {
        alert('Selecciona una categoría');
        return false;
    }
    
    if (!datosParaValidar.description.trim()) {
        alert('Escribe una descripción');
        return false;
    }
    
    if (!datosParaValidar.date) {
        alert('Selecciona una fecha');
        return false;
    }
    
    // Validaciones para compra
    if (datosParaValidar.type === 'compra') {
        if (!datosParaValidar.cardId) {
            alert('Selecciona una tarjeta');
            return false;
        }
        if (!datosParaValidar.commerceName.trim()) {
            alert('Escribe el nombre del comercio');
            return false;
        }
    }
    
    return true;
}

// Guardar en localStorage
function guardarEnElNavegador(transaccionNueva) {
    try {
        let listaDeTransacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
        listaDeTransacciones.unshift(transaccionNueva);
        localStorage.setItem('transacciones', JSON.stringify(listaDeTransacciones));
    } catch (error) {
        console.error('Error al guardar:', error);
    }
}

// Cargar transacciones
function cargarTodasLasTransacciones() {
    try {
        const todasLasTransacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
        displaytransaccionesHorizontal(todasLasTransacciones);
    } catch (error) {
        console.error('Error al cargar:', error);
    }
}

// Mostrar la lista de transacciones en la página
function mostrarTransaccionesEnPantalla(listaTransacciones) {
    const dondeVanLasTransacciones = document.getElementById('transaccionesList');
    if (!dondeVanLasTransacciones) return;
    
    // Si no hay transacciones, mostrar mensaje
    if (listaTransacciones.length === 0) {
        dondeVanLasTransacciones.innerHTML = '<p class="text-center text-muted">No hay transacciones</p>';
        return;
    }
    
    // Crear HTML para cada transacción
    const html = listaTransacciones.map(t => {
        // Definir colores según el tipo (verde para ingresos, rojo para gastos/compras)
        const color = t.type === 'ingreso' ? 'text-success' : 'text-danger';
        const sign = t.type === 'ingreso' ? '+' : '-';
        const date = new Date(t.date).toLocaleDateString('es-ES');
        
        // Si tiene tarjeta, mostrar información de la tarjeta
        let cardInfo = '';
        if (t.cardId) {
            const card = getCardById(t.cardId);
            if (card) cardInfo = `<small class="text-muted">Tarjeta: ${card.alias}</small>`;
        }
        
        // Crear el HTML de cada transacción
        return `
            <div class="transaction-item">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="badge ${t.type === 'ingreso' ? 'bg-success' : t.type === 'compra' ? 'bg-danger' : 'bg-danger'}">${t.type === 'compra' ? 'Compra' : t.type}</span>
                    <span class="${color} fw-bold">${sign}$${t.amount.toLocaleString()}</span>
                </div>
                <div class="mb-2">${t.description}</div>
                <div class="d-flex gap-3 text-muted small">
                    <span>${t.category}</span>
                    <span>${date}</span>
                </div>
                ${cardInfo}
            </div>
        `;
    }).join('');
    
    // Mostrar todas las transacciones en la página
    dondeVanLasTransacciones.innerHTML = html;
}

// Buscar una tarjeta específica por su ID
function getCardById(cardId) {
    try {
        // Obtener todas las tarjetas guardadas
        const cards = JSON.parse(localStorage.getItem('registered_cards') || '[]');
        // Buscar la tarjeta que coincida con el ID
        return cards.find(card => card.id == cardId);
    } catch (error) {
        return null;  // Si hay error, no devolver nada
    }
}


// Configurar los filtros
function configurarFiltros() {
    const botonAplicarFiltros = document.getElementById('applyFilters');
    const botonLimpiarFiltros = document.getElementById('clearFilters');
    
    if (botonAplicarFiltros) {
        botonAplicarFiltros.addEventListener('click', aplicarFiltros);
    }
    
    if (botonLimpiarFiltros) {
        botonLimpiarFiltros.addEventListener('click', limpiarFiltros);
    }
}

// Aplicar filtros
function aplicarFiltros() {
    const filtroTipo = document.getElementById('filterType').value;
    const filtroCategoria = document.getElementById('filterCategory').value;
    const filtroFechaDesde = document.getElementById('filterDateFrom').value;
    const filtroFechaHasta = document.getElementById('filterDateTo').value;
    
    let transacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
    
    // Aplicar filtros
    if (filtroTipo) {
        transacciones = transacciones.filter(t => t.type === filtroTipo);
    }
    
    if (filtroCategoria) {
        transacciones = transacciones.filter(t => t.category === filtroCategoria);
    }
    
    if (filtroFechaDesde) {
        transacciones = transacciones.filter(t => t.date >= filtroFechaDesde);
    }
    
    if (filtroFechaHasta) {
        transacciones = transacciones.filter(t => t.date <= filtroFechaHasta);
    }
    
    // Mostrar transacciones filtradas
    displaytransaccionesHorizontal(transacciones);
}

// Limpiar filtros
function limpiarFiltros() {
    document.getElementById('filterType').value = '';
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterDateFrom').value = '';
    document.getElementById('filterDateTo').value = '';
    
    // Mostrar todas las transacciones
    cargarTodasLasTransacciones();
}

// Mostrar transacciones en formato simple y ordenado
function displaytransaccionesHorizontal(transacciones) {
    const container = document.getElementById('transaccionesList');
    
    if (!transacciones || transacciones.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-secondary);"><p>No hay transacciones registradas</p></div>';
        return;
    }
    
    // Ordenar por fecha (más recientes primero)
    transacciones.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Obtener icono según el tipo
    const getIcon = (type) => {
        switch(type) {
            case 'ingreso': return '💰';
            case 'gasto': return '💸';
            case 'compra': return '🛒';
            case 'egreso': return '💸';
            default: return '💳';
        }
    };
    
    let html = '';
    
    transacciones.forEach(transaction => {
        const isPositive = transaction.type === 'ingreso';
        const amountClass = isPositive ? 'positive' : 'negative';
        const amountSign = isPositive ? '+' : '-';
        const formattedAmount = transaction.amount.toLocaleString('es-CL');
        
        // Crear detalles de la transacción
        let details = `${transaction.category} • ${formatDate(transaction.date)}`;
        if (transaction.cardId) {
            details += ` • ${getCardName(transaction.cardId)}`;
        }
        if (transaction.commerceName) {
            details += ` • ${transaction.commerceName}`;
        }
        
        html += `
            <div class="transaction-row">
                <div class="transaction-icon ${transaction.type}">
                    ${getIcon(transaction.type)}
                </div>
                <div class="transaction-info">
                    <div class="transaction-description">${transaction.description}</div>
                    <div class="transaction-details">${details}</div>
                </div>
                <div class="transaction-amount ${amountClass}">${amountSign}$${formattedAmount}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Obtener nombre de la tarjeta
function getCardName(cardId) {
    const card = getCardById(cardId);
    return card ? card.alias : 'Tarjeta desconocida';
}

// Formatear fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL');
}


// Crear datos de ejemplo si no existen transacciones
function createSampleData() {
    try {
        const existingtransacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
        
        if (existingtransacciones.length === 0) {
            const sampletransacciones = [
                {
                    id: Date.now() + 1,
                    type: 'ingreso',
                    amount: 1500000,
                    description: 'Salario mensual',
                    category: 'Trabajo',
                    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                },
                {
                    id: Date.now() + 2,
                    type: 'gasto',
                    amount: 45000,
                    description: 'Supermercado',
                    category: 'Alimentación',
                    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                },
                {
                    id: Date.now() + 3,
                    type: 'compra',
                    amount: 89000,
                    description: 'Zapatos deportivos',
                    category: 'Ropa',
                    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    cardId: 'card1',
                    commerceName: 'Deportes Max'
                },
                {
                    id: Date.now() + 4,
                    type: 'gasto',
                    amount: 25000,
                    description: 'Transporte público',
                    category: 'Transporte',
                    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                },
                {
                    id: Date.now() + 5,
                    type: 'ingreso',
                    amount: 50000,
                    description: 'Freelance diseño',
                    category: 'Trabajo',
                    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                }
            ];
            
            localStorage.setItem('transacciones', JSON.stringify(sampletransacciones));
            cargarTodasLasTransacciones(); // Recargar para mostrar los datos de ejemplo
        }
    } catch (error) {
        console.error('Error al crear datos de ejemplo:', error);
    }
}
