// Módulo de Metas de Ahorro 
// Este archivo maneja todo lo relacionado con las metas de ahorro del usuario

// Variables globales para recordar qué meta estamos editando
let currentGoalId = null;  // ID de la meta a la que queremos agregar dinero

// Cuando la página se carga completamente, ejecutamos estas funciones
document.addEventListener('DOMContentLoaded', function() {
    loadGoals();        // Cargar las metas guardadas del usuario
    setupForm();        // Configurar el formulario para crear nuevas metas
    setDefaultDate();   // Poner una fecha por defecto (1 año desde hoy)
});

// Configurar el formulario para que cuando el usuario lo envíe, se guarde la meta
function setupForm() {
    const form = document.getElementById('goalForm');  // Buscar el formulario en el HTML
    if (form) {
        // Cuando el usuario hace clic en "Crear Meta", ejecutamos saveGoal
        form.addEventListener('submit', saveGoal);
    }
}

// Poner fecha por defecto (1 año desde hoy) para que sea más fácil para el usuario
function setDefaultDate() {
    const dateInput = document.getElementById('goalDeadline');  // Buscar el campo de fecha
    if (dateInput) {
        const today = new Date();  // Fecha de hoy
        const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());  // Un año después
        dateInput.value = nextYear.toISOString().split('T')[0];  // Formato YYYY-MM-DD
    }
}

// Guardar una nueva meta cuando el usuario envía el formulario
function saveGoal(e) {
    e.preventDefault();  // Evitar que la página se recargue
    
    // Obtener los valores del formulario
    const name = document.getElementById('goalName').value;
    const amount = parseFloat(document.getElementById('goalAmount').value);
    const deadline = document.getElementById('goalDeadline').value;
    
    // Validar que todos los campos estén llenos
    if (!name || !amount || !deadline) {
        alert('Llena todos los campos');
        return;
    }
    
    // Validar que el monto sea positivo
    if (amount <= 0) {
        alert('El monto debe ser mayor a 0');
        return;
    }
    
    // Crear el objeto de la meta con todos sus datos
    const goal = {
        id: Date.now(),        // ID único basado en la fecha actual
        name: name,            // Nombre de la meta
        amount: amount,        // Monto objetivo
        deadline: deadline,    // Fecha límite
        savedAmount: 0         // Inicialmente no hay dinero ahorrado
    };
    
    // Guardar la meta en el navegador
    saveToStorage(goal);
    
    // Limpiar el formulario para crear otra meta
    document.getElementById('goalForm').reset();
    setDefaultDate();  // Poner la fecha por defecto otra vez
    
    // Recargar la lista de metas para mostrar la nueva
    loadGoals();
    
    // Mostrar mensaje de éxito
    alert('Meta creada!');
}

// Guardar la meta en el localStorage del navegador (para que persista)
function saveToStorage(goal) {
    // Obtener todas las metas guardadas (si no hay ninguna, usar array vacío)
    let goals = JSON.parse(localStorage.getItem('savings_goals') || '[]');
    
    // Agregar la nueva meta al inicio de la lista
    goals.unshift(goal);
    
    // Guardar todas las metas actualizadas en el navegador
    localStorage.setItem('savings_goals', JSON.stringify(goals));
}

// Cargar todas las metas guardadas del navegador
function loadGoals() {
    // Obtener las metas del localStorage (si no hay ninguna, usar array vacío)
    const goals = JSON.parse(localStorage.getItem('savings_goals') || '[]');
    
    // Mostrar las metas en pantalla
    displayGoals(goals);
}

// Mostrar todas las metas en pantalla
function displayGoals(goals) {
    const container = document.getElementById('goalsList');  // Buscar el contenedor en el HTML
    if (!container) return;  // Si no existe, salir de la función
    
    // Si no hay metas, mostrar mensaje
    if (goals.length === 0) {
        container.innerHTML = '<p>No hay metas. Crea una nueva!</p>';
        return;
    }
    
    // Crear HTML para cada meta
    let html = '';
    goals.forEach(goal => {
        // Calcular el porcentaje de progreso
        const progress = Math.round((goal.savedAmount / goal.amount) * 100);
        // Calcular cuánto dinero falta
        const amountLeft = goal.amount - goal.savedAmount;
        
        // Crear el HTML de la meta con todos sus datos
        html += `
            <div class="goal-card">
                <h4>${goal.name}</h4>
                <p class="amount">$${goal.amount.toLocaleString()}</p>
                <p class="progress">${progress}% completado</p>
                <div class="summary">
                    <span>Ahorrado: $${goal.savedAmount.toLocaleString()}</span>
                    <span>Falta: $${amountLeft.toLocaleString()}</span>
                </div>
                <div class="buttons">
                    <button onclick="addMoney(${goal.id})">✏️ Agregar</button>
                    <button onclick="deleteGoal(${goal.id})">🗑️ Eliminar</button>
                </div>
            </div>
        `;
    });
    
    // Mostrar todo el HTML en la página
    container.innerHTML = html;
}

// Agregar dinero a una meta específica
function addMoney(goalId) {
    // Preguntar al usuario cuánto dinero quiere agregar
    const amount = prompt('¿Cuánto dinero quieres agregar?');
    
    // Validar que el monto sea válido
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        if (amount) alert('Monto inválido');
        return;
    }
    
    // Obtener todas las metas del navegador
    let goals = JSON.parse(localStorage.getItem('savings_goals') || '[]');
    
    // Buscar la meta específica por su ID
    const goalIndex = goals.findIndex(goal => goal.id === goalId);
    
    // Si encontramos la meta, agregar el dinero
    if (goalIndex !== -1) {
        goals[goalIndex].savedAmount += parseFloat(amount);  // Sumar el dinero nuevo
        localStorage.setItem('savings_goals', JSON.stringify(goals));  // Guardar cambios
        loadGoals();  // Recargar la lista para mostrar los cambios
        alert('Dinero agregado!');
    }
}

// Eliminar una meta específica
function deleteGoal(goalId) {
    // Preguntar al usuario si está seguro de eliminar
    if (confirm('¿Eliminar esta meta?')) {
        let goals = JSON.parse(localStorage.getItem('savings_goals') || '[]');
        // Filtrar las metas para quitar la que queremos eliminar
        goals = goals.filter(goal => goal.id !== goalId);
        localStorage.setItem('savings_goals', JSON.stringify(goals));
        loadGoals();  // Recargar la lista para mostrar los cambios
        alert('Meta eliminada');
    }
}
