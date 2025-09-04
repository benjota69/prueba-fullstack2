// Módulo del Dashboard - BalanceUp
// Este archivo maneja la pantalla principal con resumen financiero

// cargar y mostrar la meta de ahorro más importante
function updateGoalsSummary() {
    try {
        var goals = JSON.parse(localStorage.getItem('savings_goals') || '[]');
        var container = document.getElementById('goalSummaryContent');
        var counter = document.getElementById('goalsCounter');
        
        if (!container) return;
        
        // Actualizar contador de metas
        if (counter) {
            counter.innerHTML = `
                <span class="goals-count">${goals.length}</span>
                <span class="goals-label">Total</span>
            `;
        }
        
        if (goals.length === 0) {
            container.innerHTML = `
                <h3 class="summary-value text-muted">No hay</h3>
                <p class="summary-label">Metas Creadas</p>
                <div class="summary-details">
                    <small class="text-muted">Crea tu primera meta de ahorro</small>
                </div>
            `;
            return;
        }
        
        // Encontrar la meta más importante (la que tiene mayor progreso o la primera)
        var mostImportantGoal = goals[0]; // Por defecto la primera
        var highestProgress = (mostImportantGoal.savedAmount / mostImportantGoal.amount) * 100;
        
        for (var i = 1; i < goals.length; i++) {
            var currentProgress = (goals[i].savedAmount / goals[i].amount) * 100;
            if (currentProgress > highestProgress) {
                mostImportantGoal = goals[i];
                highestProgress = currentProgress;
            }
        }
        
        var progress = Math.round(highestProgress);
        var amountLeft = mostImportantGoal.amount - mostImportantGoal.savedAmount;
        
        container.innerHTML = `
            <h4 class="summary-title" style="font-size: 1rem; margin-bottom: 8px; color: var(--text-primary);">${mostImportantGoal.name}</h4>
            <h3 class="summary-value text-success">$${mostImportantGoal.amount.toLocaleString()}</h3>
            <p class="summary-label">Meta Principal</p>
            <div class="summary-details">
                <small class="text-muted">
                    Progreso: ${progress}% • 
                    Faltan: $${amountLeft.toLocaleString()}
                </small>
            </div>
        `;
    } catch(err) {
        console.error('Error al cargar metas:', err);
        var container = document.getElementById('goalSummaryContent');
        var counter = document.getElementById('goalsCounter');
        
        if (container) {
            container.innerHTML = `
                <h3 class="summary-value text-muted">Error</h3>
                <p class="summary-label">al cargar metas</p>
            `;
        }
        
        if (counter) {
            counter.innerHTML = `
                <span class="goals-count">0</span>
                <span class="goals-label">Total</span>
            `;
        }
    }
}

// cuando carga la pagina hace todo esto
document.addEventListener('DOMContentLoaded', function() {
    updateGoalsSummary();
    updateUserName();
    initializeDefaultData();
    loadTransactions();
    updateFinancialData();
    // pone la fecha de hoy por defecto
    document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];
});

// pone datos de ejemplo si no hay nada guardado
function initializeDefaultData() {
    try {
        var existingTransactions = localStorage.getItem('transactions');
        if (!existingTransactions) {
            var defaultTransactions = [
                {
                    id: 1,
                    type: 'ingreso',
                    amount: 180000,
                    category: 'salario',
                    description: 'Sueldo mensual',
                    date: '2025-01-01',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    type: 'gasto',
                    amount: 25000,
                    category: 'alimentacion',
                    description: 'Supermercado',
                    date: '2025-01-02',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    type: 'gasto',
                    amount: 15000,
                    category: 'transporte',
                    description: 'Combustible',
                    date: '2025-01-03',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 4,
                    type: 'gasto',
                    amount: 12000,
                    category: 'entretenimiento',
                    description: 'Cine',
                    date: '2025-01-04',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 5,
                    type: 'gasto',
                    amount: 8000,
                    category: 'compras',
                    description: 'Ropa',
                    date: '2025-01-05',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 6,
                    type: 'ingreso',
                    amount: 50000,
                    category: 'otros',
                    description: 'Freelance',
                    date: '2025-01-06',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 7,
                    type: 'gasto',
                    amount: 30000,
                    category: 'alimentacion',
                    description: 'Restaurante',
                    date: '2025-01-07',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 8,
                    type: 'gasto',
                    amount: 18000,
                    category: 'transporte',
                    description: 'Uber',
                    date: '2025-01-08',
                    createdAt: new Date().toISOString()
                }
            ];
            
            localStorage.setItem('transactions', JSON.stringify(defaultTransactions));
            console.log('datos de ejemplo cargados');
        }
    } catch(err) {
        console.error('Error al inicializar datos por defecto:', err);
    }
}

// guarda la transaccion nueva
function saveTransaction() {
    var type = document.getElementById('transactionType').value;
    var amount = parseFloat(document.getElementById('transactionAmount').value);
    var category = document.getElementById('transactionCategory').value;
    var description = document.getElementById('transactionDescription').value;
    var date = document.getElementById('transactionDate').value;

    if (!type || !amount || !category || !description || !date) {
        alert('Por favor completa todos los campos.');
        return;
    }

    var transaction = {
        id: Date.now(),
        type: type,
        amount: amount,
        category: category,
        description: description,
        date: date,
        createdAt: new Date().toISOString()
    };

    // lo guardo en el navegador
    try {
        var transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        transactions.unshift(transaction); // lo pongo al principio
        localStorage.setItem('transactions', JSON.stringify(transactions));
    } catch(err) {
        console.error('Error al guardar transacción:', err);
        return;
    }

    // limpio el formulario
    document.getElementById('transactionForm').reset();
    document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];

    // cierro la ventana
    var modal = bootstrap.Modal.getInstance(document.getElementById('transactionModal'));
    modal.hide();

    // actualizo todo
    loadTransactions();
    updateFinancialData();

    // muestro que se guardo
    showSuccessMessage('Transacción guardada exitosamente');
}

// cargo las transacciones
function loadTransactions() {
    try {
        var transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        displayTransactions(transactions.slice(0, 5)); // solo las ultimas 5
    } catch(err) {
        console.error('Error al cargar transacciones:', err);
    }
}

// pongo las transacciones en la tabla
function displayTransactions(transactions) {
    var tbody = document.getElementById('lastTxBody');
    if (!tbody) return;

    if (transactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No hay transacciones</td></tr>';
        return;
    }

    var html = transactions.map(function(transaction) {
        var amountClass = transaction.type === 'ingreso' ? 'text-success' : 'text-danger';
        var amountSign = transaction.type === 'ingreso' ? '+' : '-';
        var formattedDate = new Date(transaction.date).toLocaleDateString('es-ES');
        
        return `
            <tr>
                <td class="transaction-date">${formattedDate}</td>
                <td>${transaction.description}</td>
                <td class="text-end ${amountClass}">${amountSign}$${transaction.amount.toLocaleString()}</td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = html;
}

// analizar gastos por categoria
function analyzeExpensesByCategory() {
    try {
        var transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        var expensesByCategory = {};
        var totalExpenses = 0;

        // calcular gastos por categoria
        transactions.forEach(function(transaction) {
            if (transaction.type === 'gasto') {
                var category = transaction.category || 'otros';
                if (!expensesByCategory[category]) {
                    expensesByCategory[category] = 0;
                }
                expensesByCategory[category] += transaction.amount;
                totalExpenses += transaction.amount;
            }
        });

        // convertir a array y ordenar por monto
        var categoriesArray = Object.keys(expensesByCategory).map(function(category) {
            var percentage = totalExpenses > 0 ? (expensesByCategory[category] / totalExpenses) * 100 : 0;
            return {
                category: category,
                amount: expensesByCategory[category],
                percentage: Math.round(percentage)
            };
        }).sort(function(a, b) {
            return b.amount - a.amount;
        });

        return {
            categories: categoriesArray,
            totalExpenses: totalExpenses
        };
    } catch(err) {
        console.error('Error al analizar gastos por categoria:', err);
        return { categories: [], totalExpenses: 0 };
    }
}

// calculo el balance y todo eso
function updateFinancialData() {
    try {
        var transactions = JSON.parse(localStorage.getItem('transactions') || '[]');

        var totalIncome = 0;
        var totalExpenses = 0;

        transactions.forEach(function(transaction) {
            if (transaction.type === 'ingreso') {
                totalIncome += transaction.amount;
            } else if (transaction.type === 'gasto') {
                totalExpenses += transaction.amount;
            }
        });

        var balance = totalIncome - totalExpenses;

        // actualizo los numeros en pantalla
        document.getElementById('balanceAmount').textContent = '$' + balance.toLocaleString();
        document.getElementById('incomeAmount').textContent = '$' + totalIncome.toLocaleString();
        document.getElementById('expenseAmount').textContent = '$' + totalExpenses.toLocaleString();

        // cambio los colores segun si es positivo o negativo
        var balanceElement = document.getElementById('balanceAmount');
        balanceElement.className = 'card-value ' + (balance >= 0 ? 'text-success' : 'text-danger');

        // colores fijos para ingresos y gastos
        var incomeElement = document.getElementById('incomeAmount');
        var expenseElement = document.getElementById('expenseAmount');
        
        incomeElement.className = 'card-value text-success';
        expenseElement.className = 'card-value text-danger';

        // actualizar graficos dinamicos
        updateDynamicCharts();

    } catch(err) {
        console.error('Error al actualizar datos financieros:', err);
    }
}

// actualizar graficos dinamicos con datos reales
function updateDynamicCharts() {
    try {
        var expenseData = analyzeExpensesByCategory();
        
        // mapeo de categorias a emojis y colores
        var categoryInfo = {
            'alimentacion': { emoji: '🍔', color: '#FF6B6B', name: 'Alimentación' },
            'transporte': { emoji: '🚗', color: '#4ECDC4', name: 'Transporte' },
            'entretenimiento': { emoji: '🎬', color: '#45B7D1', name: 'Entretenimiento' },
            'compras': { emoji: '🛒', color: '#96CEB4', name: 'Compras' },
            'salario': { emoji: '💰', color: '#FFD93D', name: 'Salario' },
            'otros': { emoji: '📦', color: '#C7C7C7', name: 'Otros' }
        };

        updateDonutChart(expenseData, categoryInfo);
        updateCategoriesList(expenseData, categoryInfo);
        updateDonutLegend(expenseData, categoryInfo);
        
    } catch(err) {
        console.error('Error al actualizar gráficos dinámicos:', err);
    }
}

// actualizar grafico de dona con datos reales
function updateDonutChart(expenseData, categoryInfo) {
    try {
        var donutChart = document.getElementById('donutChart');
        var donutTotal = document.querySelector('.donut-total');
        
        if (!donutChart || !donutTotal) return;

        if (expenseData.categories.length === 0) {
            // sin gastos - mostrar grafico vacio
            donutChart.style.background = 'conic-gradient(#e9ecef 0deg 360deg)';
            donutTotal.textContent = '0%';
            return;
        }

        // crear gradiente conico basado en datos reales
        var gradientParts = [];
        var currentDegree = 0;

        expenseData.categories.forEach(function(category) {
            var info = categoryInfo[category.category] || categoryInfo['otros'];
            var degrees = (category.percentage / 100) * 360;
            var endDegree = currentDegree + degrees;
            
            gradientParts.push(info.color + ' ' + currentDegree + 'deg ' + endDegree + 'deg');
            currentDegree = endDegree;
        });

        var gradient = 'conic-gradient(' + gradientParts.join(', ') + ')';
        donutChart.style.background = gradient;
        donutTotal.textContent = '100%';

        // actualizar el evento click del grafico de dona
        updateDonutClickEvent(expenseData, categoryInfo);

    } catch(err) {
        console.error('Error al actualizar gráfico de dona:', err);
    }
}

// actualizar evento click del grafico de dona con datos reales
function updateDonutClickEvent(expenseData, categoryInfo) {
    try {
        var donutChart = document.getElementById('donutChart');
        if (!donutChart) return;

        // remover eventos anteriores clonando el elemento
        var newDonutChart = donutChart.cloneNode(true);
        donutChart.parentNode.replaceChild(newDonutChart, donutChart);

        // agregar nuevo evento con datos actualizados
        newDonutChart.addEventListener('click', function() {
            if (expenseData.categories.length === 0) {
                alert('No hay gastos registrados aún.\n\nAgrega algunas transacciones para ver la distribución de gastos.');
                return;
            }

            var message = 'Distribución de Gastos:\n\n';
            
            expenseData.categories.forEach(function(category) {
                var info = categoryInfo[category.category] || categoryInfo['otros'];
                message += info.name + ': ' + category.percentage + '% - $' + category.amount.toLocaleString() + '\n';
            });

            message += '\nTotal gastado: $' + expenseData.totalExpenses.toLocaleString();
            
            alert(message);
        });

    } catch(err) {
        console.error('Error al actualizar evento click del gráfico:', err);
    }
}

// actualizar leyenda del grafico de dona con datos reales
function updateDonutLegend(expenseData, categoryInfo) {
    try {
        var donutLegend = document.getElementById('donutLegend');
        
        if (!donutLegend) return;

        if (expenseData.categories.length === 0) {
            donutLegend.innerHTML = `
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #e9ecef;"></div>
                    <span>Sin gastos: 0%</span>
                </div>
            `;
            return;
        }

        var html = '';
        
        // mostrar hasta las 4 categorias principales en la leyenda
        var topCategories = expenseData.categories.slice(0, 4);
        
        topCategories.forEach(function(category, index) {
            var info = categoryInfo[category.category] || categoryInfo['otros'];
            html += `
                <div class="legend-item" data-category="${category.category}" data-amount="${category.amount}" data-percentage="${category.percentage}">
                    <div class="legend-color" style="background-color: ${info.color};"></div>
                    <span>${info.name}: ${category.percentage}%</span>
                </div>
            `;
        });

        donutLegend.innerHTML = html;

        // agregar eventos click a los elementos de la leyenda
        var legendItems = donutLegend.querySelectorAll('.legend-item');
        legendItems.forEach(function(item) {
            item.addEventListener('click', function() {
                var categoryKey = this.getAttribute('data-category');
                var amount = parseInt(this.getAttribute('data-amount'));
                var percentage = parseInt(this.getAttribute('data-percentage'));
                var info = categoryInfo[categoryKey] || categoryInfo['otros'];
                
                var message = info.name + ':\n\n';
                message += percentage + '% de tus gastos totales\n';
                message += 'Monto gastado: $' + amount.toLocaleString() + '\n\n';
                
                // calcular el promedio diario estimado
                var avgDaily = Math.round(amount / 30);
                message += 'Promedio estimado diario: $' + avgDaily.toLocaleString();
                
                alert(message);
            });
        });

    } catch(err) {
        console.error('Error al actualizar leyenda del gráfico:', err);
    }
}

// actualizar lista de categorias con datos reales
function updateCategoriesList(expenseData, categoryInfo) {
    try {
        var categoriesList = document.querySelector('.categories-list');
        var categoriesTotal = document.querySelector('.categories-total strong');
        
        if (!categoriesList) return;

        if (expenseData.categories.length === 0) {
            categoriesList.innerHTML = `
                <div class="category-item">
                    <div class="category-icon">📊</div>
                    <div class="category-info">
                        <div class="category-name">Sin gastos registrados</div>
                        <div class="category-amount">$0</div>
                    </div>
                    <div class="category-bar">
                        <div class="category-fill" style="width: 0%; background-color: #e9ecef;"></div>
                    </div>
                </div>
            `;
            if (categoriesTotal) categoriesTotal.textContent = '$0';
            return;
        }

        // mostrar hasta las 4 categorias principales
        var topCategories = expenseData.categories.slice(0, 4);
        var html = '';

        topCategories.forEach(function(category) {
            var info = categoryInfo[category.category] || categoryInfo['otros'];
            html += `
                <div class="category-item">
                    <div class="category-icon">${info.emoji}</div>
                    <div class="category-info">
                        <div class="category-name">${info.name}</div>
                        <div class="category-amount">$${category.amount.toLocaleString()}</div>
                    </div>
                    <div class="category-bar">
                        <div class="category-fill" style="width: ${category.percentage}%; background-color: ${info.color};"></div>
                    </div>
                </div>
            `;
        });

        categoriesList.innerHTML = html;
        if (categoriesTotal) {
            categoriesTotal.textContent = '$' + expenseData.totalExpenses.toLocaleString();
        }

    } catch(err) {
        console.error('Error al actualizar lista de categorías:', err);
    }
}

// muestra el mensaje de que se guardo
function showSuccessMessage(message) {
    var notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.textContent = message;
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
    
    setTimeout(function() {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(function() {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Función para actualizar el nombre del usuario en el dashboard
function updateDashboardUserName() {
    try {
        var userName = localStorage.getItem('app_user_name') || 'Usuario';
        var dashUserNameElement = document.getElementById('dashUserName');
        if (dashUserNameElement) {
            dashUserNameElement.textContent = userName;
        }
    } catch(err) {
        console.error('Error al cargar nombre de usuario en dashboard:', err);
    }
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    updateDashboardUserName();
});
