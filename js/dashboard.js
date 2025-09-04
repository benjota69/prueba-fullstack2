// Módulo del Dashboard - BalanceUp
// Este archivo maneja la pantalla principal con resumen financiero

(function(){
    // Leer nombre del usuario del localStorage
    var userName = localStorage.getItem('app_user_name') || '';
    var dashUserName = document.getElementById('dashUserName');
    if (dashUserName) {
        dashUserName.textContent = userName || 'Usuario';
    }

    // Variables para los datos financieros principales
    var balance = 0, income = 0, expense = 0, txs = [];
    
    // Leer datos guardados del navegador o usar valores por defecto
    balance = Number(localStorage.getItem('demo_balance') || 125000);
    income = Number(localStorage.getItem('demo_income') || 180000);
    expense = Number(localStorage.getItem('demo_expense') || 55000);
    
    // Leer transacciones guardadas o usar las de ejemplo
    var raw = localStorage.getItem('demo_txs');
    if (raw) {
        txs = JSON.parse(raw);
    } else {
        txs = [
            { date: '2025-08-01', desc: 'Sueldo', amount: 180000 },
            { date: '2025-08-02', desc: 'Supermercado', amount: -25000 },
            { date: '2025-08-03', desc: 'Transporte', amount: -6000 },
            { date: '2025-08-04', desc: 'Restaurante', amount: -18000 }
        ];
    }

    // Función para formatear números: convierte 125000 en "+$125.000" o "-$125.000"
    function fmt(n){
        var sign = n >= 0 ? '+' : '-';
        var absValue = Math.abs(n);
        return sign + '$' + absValue.toLocaleString('es-CL');
    }

    var balanceAmount = document.getElementById('balanceAmount');
    var incomeAmount = document.getElementById('incomeAmount');
    var expenseAmount = document.getElementById('expenseAmount');
    if (balanceAmount) balanceAmount.textContent = fmt(balance);
    if (incomeAmount) {
        incomeAmount.textContent = fmt(income);
        incomeAmount.style.fontWeight = 'bold';
        incomeAmount.style.color = '#28a745'; // verde
    }
    if (expenseAmount) {
        expenseAmount.textContent = fmt(expense);
        expenseAmount.style.fontWeight = 'bold';
        expenseAmount.style.color = '#dc3545'; // rojo
    }

    var body = document.getElementById('lastTxBody');
    if (body) {
        body.innerHTML = '';
        txs.slice(0, 5).forEach(function(tx){
            var tr = document.createElement('tr');
            var td1 = document.createElement('td'); td1.textContent = tx.date;
            var td2 = document.createElement('td'); td2.textContent = tx.desc;
            var td3 = document.createElement('td'); td3.className = 'text-end ' + (tx.amount < 0 ? 'text-danger' : 'text-success'); td3.textContent = fmt(tx.amount);
            tr.appendChild(td1); tr.appendChild(td2); tr.appendChild(td3);
            body.appendChild(tr);
        });
    }

    // Función para dibujar gráfico de barras
    function drawBarChart() {
        var canvas = document.getElementById('barChart');
        if (!canvas) return;
        
        var ctx = canvas.getContext('2d');
        var width = canvas.width;
        var height = canvas.height;
        
        // Limpiar canvas
        ctx.clearRect(0, 0, width, height);
        
        // Configurar colores
        var greenColor = '#28a745';
        var redColor = '#dc3545';
        
        // Dibujar barras
        var barWidth = 60;
        var barSpacing = 40;
        var startX = 50;
        var maxHeight = height - 60;
        
        // Escalar los valores para que quepan en el canvas
        var maxValue = Math.max(income, expense);
        var scale = maxHeight / maxValue;
        
        // Barra de ingresos (verde)
        var incomeHeight = income * scale;
        ctx.fillStyle = greenColor;
        ctx.fillRect(startX, height - 40 - incomeHeight, barWidth, incomeHeight);
        
        // Barra de gastos (rojo)
        var expenseHeight = expense * scale;
        ctx.fillRect(startX + barWidth + barSpacing, height - 40 - expenseHeight, barWidth, expenseHeight);
        
        // Etiquetas
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Ingresos', startX + barWidth/2, height - 20);
        ctx.fillText('Gastos', startX + barWidth + barSpacing + barWidth/2, height - 20);
        
        // Valores en las barras
        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px Arial';
        ctx.fillText(fmt(income), startX + barWidth/2, height - 40 - incomeHeight + 15);
        ctx.fillText(fmt(expense), startX + barWidth + barSpacing + barWidth/2, height - 40 - expenseHeight + 15);
    }
    
    // Función para dibujar gráfico circular
    function drawPieChart() {
        var canvas = document.getElementById('pieChart');
        if (!canvas) return;
        
        var ctx = canvas.getContext('2d');
        var width = canvas.width;
        var height = canvas.height;
        
        // Limpiar canvas
        ctx.clearRect(0, 0, width, height);
        
        // Configurar colores
        var greenColor = '#28a745';
        var redColor = '#dc3545';
        
        // Centro del círculo
        var centerX = width / 2;
        var centerY = height / 2;
        var radius = Math.min(width, height) / 3;
        
        // Calcular ángulos
        var total = income + expense;
        var incomeAngle = (income / total) * 2 * Math.PI;
        var expenseAngle = (expense / total) * 2 * Math.PI;
        
        // Dibujar sector de ingresos
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, 0, incomeAngle);
        ctx.closePath();
        ctx.fillStyle = greenColor;
        ctx.fill();
        
        // Dibujar sector de gastos
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, incomeAngle, incomeAngle + expenseAngle);
        ctx.closePath();
        ctx.fillStyle = redColor;
        ctx.fill();
        
        // Leyenda
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Ingresos: ' + fmt(income), 10, height - 40);
        ctx.fillText('Gastos: ' + fmt(expense), 10, height - 20);
    }
    
    // Dibujar los gráficos
    drawBarChart();
    drawPieChart();

    // Gráfico de dona interactivo
    function initDonutChart() {
        var donutLegend = document.getElementById('donutLegend');
        if (!donutLegend) return;
        
        // Crear leyenda interactiva
        var segments = [
            { label: 'Comida', value: 40, color: '#FF6B6B' },
            { label: 'Transporte', value: 25, color: '#4ECDC4' },
            { label: 'Entretenimiento', value: 20, color: '#45B7D1' },
            { label: 'Otros', value: 15, color: '#96CEB4' }
        ];
        
        segments.forEach(function(segment) {
            var legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            legendItem.innerHTML = `
                <div class="legend-color" style="background-color: ${segment.color}"></div>
                <span>${segment.label}: ${segment.value}%</span>
            `;
            
            // Interactividad: click para ver detalles
            legendItem.addEventListener('click', function() {
                alert(`${segment.label}:\n${segment.value}% de tus gastos totales\nAproximadamente ${fmt(expense * segment.value / 100)}`);
            });
            
            donutLegend.appendChild(legendItem);
        });
        
        // Hacer el gráfico de dona clickeable
        var donutChart = document.getElementById('donutChart');
        donutChart.addEventListener('click', function() {
            alert('Distribución de Gastos:\n' +
                  'Comida: 40% - ' + fmt(expense * 0.4) + '\n' +
                  'Transporte: 25% - ' + fmt(expense * 0.25) + '\n' +
                  'Entretenimiento: 20% - ' + fmt(expense * 0.2) + '\n' +
                  'Otros: 15% - ' + fmt(expense * 0.15));
        });
    }
    
    // Gráfico de metas completadas interactivo
    function initGoalsChart() {
        var goalItems = document.querySelectorAll('.goal-item');
        
        goalItems.forEach(function(item) {
            item.addEventListener('click', function() {
                var goal = this.getAttribute('data-goal');
                var progress = this.getAttribute('data-progress');
                
                // Mensajes personalizados para cada meta
                var messages = {
                    'ahorro': {
                        title: 'Ahorro Mensual',
                        message: 'Has ahorrado el 75% de tu meta mensual.\n\nMeta: $200.000\nActual: ' + fmt(balance) + '\nFaltan: ' + fmt(200000 - balance),
                        tip: '💡 Consejo: Intenta ahorrar al menos el 20% de tus ingresos.'
                    },
                    'gastos': {
                        title: 'Control de Gastos',
                        message: 'Tienes un 60% de control sobre tus gastos.\n\nGastos actuales: ' + fmt(expense) + '\nIngresos: ' + fmt(income),
                        tip: '💡 Consejo: Revisa tus gastos diarios para identificar áreas de mejora.'
                    },
                    'inversion': {
                        title: 'Inversión',
                        message: '¡Excelente! Tienes un 90% de cumplimiento en inversiones.\n\nBalance de inversión: ' + fmt(balance * 0.9),
                        tip: '💡 Consejo: Considera diversificar tus inversiones.'
                    },
                    'emergencia': {
                        title: 'Fondo de Emergencia',
                        message: 'Tu fondo de emergencia está al 45%.\n\nMeta: 6 meses de gastos\nActual: ' + fmt(expense * 6 * 0.45),
                        tip: '💡 Consejo: Intenta tener al menos 6 meses de gastos ahorrados.'
                    }
                };
                
                var goalInfo = messages[goal];
                alert(goalInfo.title + ':\n\n' + goalInfo.message + '\n\n' + goalInfo.tip);
            });
            
            // Animación de las barras de progreso
            var progressFill = this.querySelector('.progress-fill-small');
            var percentage = this.getAttribute('data-progress');
            
            // Animar la barra después de un pequeño delay
            setTimeout(function() {
                progressFill.style.width = percentage + '%';
            }, 500 + Math.random() * 1000);
        });
    }
    
    // Inicializar gráficos bonitos
    initDonutChart();
    initGoalsChart();
})();


