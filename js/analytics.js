// Módulo de Análisis Financiero
// Este archivo maneja los análisis y gráficos financieros

// Cuando la página se carga, ejecutar estas funciones
document.addEventListener('DOMContentLoaded', function() {
    // Configurar el mes actual por defecto
    const currentMonth = new Date().getMonth() + 1;
    document.getElementById('monthFilter').value = currentMonth;
    
    // Configurar el filtro de mes para cambiar análisis
    document.getElementById('monthFilter').addEventListener('change', function() {
        updateAnalytics(this.value);
    });
    
    // Inicializar análisis con el mes actual
    updateAnalytics(currentMonth);
    
    // Crear gráfico de tendencias de los últimos meses
    createTrendChart();
});

// Función principal para actualizar todo el análisis cuando cambia el mes
function updateAnalytics(month) {
    // Obtener datos simulados del mes seleccionado
    const monthData = getMonthData(month);
    
    // Actualizar las tarjetas de resumen (ingresos, gastos, ahorro)
    updateSummaryCards(monthData);
    
    // Actualizar el gráfico de dona con las categorías de gastos
    updateDonutChart(monthData.categories);
    
    // Actualizar el análisis de patrones e insights
    updatePatternAnalysis(monthData);
    
    // Mostrar notificación de que cambió el mes
    showMonthChangeNotification(month);
}

// Función para obtener datos del mes
function getMonthData(month) {
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    // Simular datos diferentes para cada mes
    const baseIncome = 2000 + (month * 50);
    const baseExpenses = 1500 + (month * 30);
    const savings = baseIncome - baseExpenses;
    const savingsRate = ((savings / baseIncome) * 100).toFixed(1);
    
    return {
        month: monthNames[month - 1],
        income: baseIncome,
        expenses: baseExpenses,
        savings: savings,
        savingsRate: savingsRate,
        categories: {
            alimentacion: Math.round(baseExpenses * 0.35),
            transporte: Math.round(baseExpenses * 0.25),
            entretenimiento: Math.round(baseExpenses * 0.20),
            otros: Math.round(baseExpenses * 0.20)
        }
    };
}

// Función para actualizar tarjetas de resumen
function updateSummaryCards(data) {
    // Actualizar ingresos
    document.querySelector('.summary-card:nth-child(1) .card-value').textContent = `$${data.income.toLocaleString()}`;
    
    // Actualizar gastos
    document.querySelector('.summary-card:nth-child(2) .card-value').textContent = `$${data.expenses.toLocaleString()}`;
    
    // Actualizar ahorro
    document.querySelector('.summary-card:nth-child(3) .card-value').textContent = `$${data.savings.toLocaleString()}`;
    
    // Actualizar tasa de ahorro
    document.querySelector('.summary-card:nth-child(4) .card-value').textContent = `${data.savingsRate}%`;
    
    // Actualizar total en el gráfico de dona
    document.querySelector('.donut-total').textContent = `$${data.expenses.toLocaleString()}`;
}

// Función para actualizar gráfico de dona
function updateDonutChart(categories) {
    const total = Object.values(categories).reduce((sum, value) => sum + value, 0);
    
    // Actualizar leyenda con valores
    const legendItems = document.querySelectorAll('.legend-item');
    const categoryNames = ['Alimentación', 'Transporte', 'Entretenimiento', 'Otros'];
    const categoryValues = Object.values(categories);
    
    legendItems.forEach((item, index) => {
        const percentage = ((categoryValues[index] / total) * 100).toFixed(1);
        const span = item.querySelector('span');
        span.textContent = `${categoryNames[index]} (${percentage}%)`;
    });
}

// Función para actualizar análisis de patrones
function updatePatternAnalysis(data) {
    const insights = document.querySelectorAll('.insight-item');
    
    // Actualizar primer insight
    insights[0].querySelector('h4').textContent = `Mayor Gasto: ${getHighestCategory(data.categories)}`;
    insights[0].querySelector('p').textContent = 
        `El ${getHighestPercentage(data.categories)}% de tus gastos van a ${getHighestCategory(data.categories).toLowerCase()}. Considera revisar opciones más económicas.`;
    
    // Actualizar segundo insight
    const trend = data.savingsRate > 20 ? 'positiva' : 'negativa';
    const trendIcon = data.savingsRate > 20 ? 'text-success' : 'text-danger';
    const trendEmoji = data.savingsRate > 20 ? '📈' : '📉';
    insights[1].querySelector('.insight-icon span').className = trendIcon;
    insights[1].querySelector('.insight-icon span').textContent = trendEmoji;
    insights[1].querySelector('h4').textContent = `Tendencia ${trend.charAt(0).toUpperCase() + trend.slice(1)}`;
    insights[1].querySelector('p').textContent = 
        `Tu tasa de ahorro es del ${data.savingsRate}%. ${data.savingsRate > 20 ? '¡Excelente trabajo!' : 'Considera revisar tus gastos.'}`;
    
    // Actualizar tercer insight
    const unusualExpense = getUnusualExpense(data.categories);
    insights[2].querySelector('h4').textContent = unusualExpense.title;
    insights[2].querySelector('p').textContent = unusualExpense.description;
}

// Función para obtener la categoría con mayor gasto
function getHighestCategory(categories) {
    const maxValue = Math.max(...Object.values(categories));
    for (const [category, value] of Object.entries(categories)) {
        if (value === maxValue) {
            return category.charAt(0).toUpperCase() + category.slice(1);
        }
    }
    return 'Otros';
}

// Función para obtener el porcentaje de la categoría más alta
function getHighestPercentage(categories) {
    const total = Object.values(categories).reduce((sum, value) => sum + value, 0);
    const maxValue = Math.max(...Object.values(categories));
    return ((maxValue / total) * 100).toFixed(1);
}

// Función para detectar gastos inusuales
function getUnusualExpense(categories) {
    const total = Object.values(categories).reduce((sum, value) => sum + value, 0);
    const avgExpense = total / Object.keys(categories).length;
    
    for (const [category, value] of Object.entries(categories)) {
        if (value > avgExpense * 1.5) {
            return {
                title: `Gasto Alto: ${category.charAt(0).toUpperCase() + category.slice(1)}`,
                description: `Detectamos un gasto alto en ${category}. Considera si es necesario o si puedes optimizarlo.`
            };
        }
    }
    
    return {
        title: 'Gastos Balanceados',
        description: 'Tus gastos están bien distribuidos entre categorías. ¡Mantén este equilibrio!'
    };
}

// Función para crear gráfico de tendencias
function createTrendChart() {
    const canvas = document.getElementById('trendChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Datos simulados de los últimos 6 meses
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    const expenses = [1800, 1650, 1900, 1750, 1890, 2100];
    const income = [2200, 2250, 2300, 2350, 2450, 2500];
    
    // Dibujar gráfico simple
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);
    
    // Dibujar ejes
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    
    // Eje Y
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();
    
    // Eje X
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Dibujar líneas de tendencia
    const maxValue = Math.max(...income, ...expenses);
    const minValue = Math.min(...income, ...expenses);
    const range = maxValue - minValue;
    
    // Línea de ingresos
    ctx.strokeStyle = '#2e7d32';
    ctx.lineWidth = 3;
    ctx.beginPath();
    income.forEach((value, index) => {
        const x = padding + (index * (width - 2 * padding) / (months.length - 1));
        const y = height - padding - ((value - minValue) / range) * (height - 2 * padding);
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
    
    // Línea de gastos
    ctx.strokeStyle = '#d32f2f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    expenses.forEach((value, index) => {
        const x = padding + (index * (width - 2 * padding) / (months.length - 1));
        const y = height - padding - ((value - minValue) / range) * (height - 2 * padding);
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
    
    // Dibujar etiquetas de meses
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    months.forEach((month, index) => {
        const x = padding + (index * (width - 2 * padding) / (months.length - 1));
        ctx.fillText(month, x, height - padding + 20);
    });
    
    // Leyenda
    ctx.fillStyle = '#2e7d32';
    ctx.fillRect(width - 120, padding, 15, 15);
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Ingresos', width - 100, padding + 12);
    
    ctx.fillStyle = '#d32f2f';
    ctx.fillRect(width - 120, padding + 25, 15, 15);
    ctx.fillStyle = '#666';
    ctx.fillText('Gastos', width - 100, padding + 37);
}

// Función para mostrar notificación de cambio de mes
function showMonthChangeNotification(month) {
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.className = 'month-change-notification';
    notification.textContent = `Análisis actualizado para ${monthNames[month - 1]}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(46, 125, 50, 0.3);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remover notificación después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Agregar estilos de animación para las notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
