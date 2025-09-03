// Módulo de Transacciones 
// Este archivo maneja las transacciones (ingresos, gastos y compras)

// Cuando la página se carga, ejecutar estas funciones
document.addEventListener('DOMContentLoaded', function() {
    loadTransactions();  // Cargar transacciones existentes
    setupForm();         // Configurar el formulario
    setTodayDate();      // Poner fecha de hoy por defecto
});

// Configurar formulario
function setupForm() {
    const form = document.getElementById('transactionForm');
    const typeSelect = document.getElementById('transactionType');
    
    if (form) {
        form.addEventListener('submit', saveTransaction);
    }
    
    if (typeSelect) {
        typeSelect.addEventListener('change', showCardFields);
    }
}

// Poner fecha de hoy
function setTodayDate() {
    const dateInput = document.getElementById('transactionDate');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
}

// Mostrar u ocultar campos según el tipo de transacción
function showCardFields() {
    const type = document.getElementById('transactionType').value;
    const cardGroup = document.getElementById('cardSelectionGroup');
    const commerceGroup = document.getElementById('commerceGroup');
    
    // Si es una compra, mostrar campos de tarjeta y comercio
    if (type === 'compra') {
        cardGroup.style.display = 'block';
        commerceGroup.style.display = 'block';
        loadCards();  // Cargar las tarjetas disponibles
    } else {
        // Para ingresos y gastos, ocultar estos campos
        cardGroup.style.display = 'none';
        commerceGroup.style.display = 'none';
    }
}

// Cargar las tarjetas registradas en el selector
function loadCards() {
    const cardSelect = document.getElementById('transactionCard');
    if (!cardSelect) return;
    
    try {
        // Obtener tarjetas guardadas en el navegador
        const cards = JSON.parse(localStorage.getItem('registered_cards') || '[]');
        cardSelect.innerHTML = '<option value="">Seleccionar tarjeta</option>';
        
        // Crear opciones para cada tarjeta (mostrando solo últimos 4 dígitos)
        cards.forEach(card => {
            const option = document.createElement('option');
            option.value = card.id;
            option.textContent = `${card.alias} (••••${card.number.slice(-4)})`;
            cardSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar tarjetas:', error);
    }
}

// Guardar una nueva transacción
function saveTransaction(e) {
    e.preventDefault();
    
    // Obtener todos los datos del formulario
    const data = {
        type: document.getElementById('transactionType').value,
        amount: parseFloat(document.getElementById('transactionAmount').value),
        category: document.getElementById('transactionCategory').value,
        description: document.getElementById('transactionDescription').value,
        date: document.getElementById('transactionDate').value,
        cardId: document.getElementById('transactionCard').value,
        commerceName: document.getElementById('commerceName').value
    };
    
    // Validar que todos los datos sean correctos
    if (!validateTransaction(data)) {
        return;
    }
    
    // Crear el objeto de la transacción
    const transaction = {
        id: Date.now(),  // ID único
        ...data,
        createdAt: new Date().toISOString()
    };
    
    // Guardar en el navegador
    saveToStorage(transaction);
    
    // Limpiar el formulario y recargar la lista
    document.getElementById('transactionForm').reset();
    setTodayDate();
    showCardFields();
    loadTransactions();
    
    alert('Transacción guardada exitosamente!');
}

// Validar transacción
function validateTransaction(data) {
    if (!data.type) {
        alert('Selecciona el tipo de transacción');
        return false;
    }
    
    if (!data.amount || data.amount <= 0) {
        alert('El monto debe ser mayor a 0');
        return false;
    }
    
    if (!data.category) {
        alert('Selecciona una categoría');
        return false;
    }
    
    if (!data.description.trim()) {
        alert('Escribe una descripción');
        return false;
    }
    
    if (!data.date) {
        alert('Selecciona una fecha');
        return false;
    }
    
    // Validaciones para compra
    if (data.type === 'compra') {
        if (!data.cardId) {
            alert('Selecciona una tarjeta');
            return false;
        }
        if (!data.commerceName.trim()) {
            alert('Escribe el nombre del comercio');
            return false;
        }
    }
    
    return true;
}

// Guardar en localStorage
function saveToStorage(transaction) {
    try {
        let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        transactions.unshift(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));
    } catch (error) {
        console.error('Error al guardar:', error);
    }
}

// Cargar transacciones
function loadTransactions() {
    try {
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        displayTransactions(transactions);
    } catch (error) {
        console.error('Error al cargar:', error);
    }
}

// Mostrar la lista de transacciones en la página
function displayTransactions(transactions) {
    const container = document.getElementById('transactionsList');
    if (!container) return;
    
    // Si no hay transacciones, mostrar mensaje
    if (transactions.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">No hay transacciones</p>';
        return;
    }
    
    // Crear HTML para cada transacción
    const html = transactions.map(t => {
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
    container.innerHTML = html;
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
