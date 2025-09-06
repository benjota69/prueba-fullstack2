// Módulo del Dashboard - BalanceUp
// Este archivo maneja la pantalla principal con resumen financiero

// cargar y mostrar la meta de ahorro más importante
function actualizarResumenMetas() {
    try {
        var metas = JSON.parse(localStorage.getItem('savings_metas') || '[]');
        var contenedor = document.getElementById('metasummaryContent');
        var contador = document.getElementById('metasCounter');
        
        if (!contenedor) return;
        
        // Actualizar contador de metas
        if (contador) {
            contador.innerHTML = `
                <span class="metas-count">${metas.length}</span>
                <span class="metas-label">Total</span>
            `;
        }
        
        if (metas.length === 0) {
            contenedor.innerHTML = `
                <h3 class="summary-value text-muted">No hay</h3>
                <p class="summary-label">Metas Creadas</p>
                <div class="summary-details">
                    <small class="text-muted">Crea tu primera meta de ahorro</small>
                </div>
            `;
            return;
        }
        
        // Buscar la meta más importante (la que tiene mayor progreso)
        var metaMasImportante = metas[0]; 
        var mayorProgreso = (metaMasImportante.savedAmount / metaMasImportante.amount) * 100;
        
        for (var i = 1; i < metas.length; i++) {
            var progresoActual = (metas[i].savedAmount / metas[i].amount) * 100;
            if (progresoActual > mayorProgreso) {
                metaMasImportante = metas[i];
                mayorProgreso = progresoActual;
            }
        }
        
        var progreso = Math.round(mayorProgreso);
        var cuantoFalta = metaMasImportante.amount - metaMasImportante.savedAmount;
        
        contenedor.innerHTML = `
            <h4 class="summary-title" style="font-size: 1rem; margin-bottom: 8px; color: var(--text-primary);">${metaMasImportante.name}</h4>
            <h3 class="summary-value text-success">$${metaMasImportante.amount.toLocaleString()}</h3>
            <p class="summary-label">Meta Principal</p>
            <div class="summary-details">
                <small class="text-muted">
                    Progreso: ${progreso}% • 
                    Faltan: $${cuantoFalta.toLocaleString()}
                </small>
            </div>
        `;
    } catch(err) {
        console.error('Error al cargar metas:', err);
    }
}

// Cuando carga la página, hacer todo esto
document.addEventListener('DOMContentLoaded', function() {
    // Primero cargar datos de ejemplo si no existen
    ponerDatosDeEjemplo();
    
    // Luego cargar y mostrar los datos
    ponerNombreEnSidebar();
    ponerNombreEnDashboard();
    cargarTransacciones();
    actualizarDatosFinancieros();
    actualizarResumenMetas();
    actualizarGraficosDinamicos();
    
    // Poner la fecha de hoy por defecto
    var fechaInput = document.getElementById('transactionDate');
    if (fechaInput) {
        fechaInput.value = new Date().toISOString().split('T')[0];
    }
});

// Poner datos de ejemplo si no hay nada guardado
function ponerDatosDeEjemplo() {
    try {
        var transaccionesExistentes = localStorage.getItem('transacciones');
        if (!transaccionesExistentes) {
            var datosDeEjemplo = [
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
                }
            ];
            
            localStorage.setItem('transacciones', JSON.stringify(datosDeEjemplo));
            console.log('Datos de ejemplo cargados');
        }

        // También cargar metas de ejemplo si no existen
        var metasExistentes = localStorage.getItem('savings_metas');
        if (!metasExistentes) {
            var metasDeEjemplo = [
                {
                    id: 1,
                    name: 'Viaje a Europa',
                    amount: 500000,
                    savedAmount: 125000,
                    category: 'viajes',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'Computador Nuevo',
                    amount: 300000,
                    savedAmount: 80000,
                    category: 'tecnologia',
                    createdAt: new Date().toISOString()
                }
            ];
            
            localStorage.setItem('savings_metas', JSON.stringify(metasDeEjemplo));
            console.log('Metas de ejemplo cargadas');
        }
    } catch(err) {
        console.error('Error al cargar datos de ejemplo:', err);
    }
}

// Guardar la transacción nueva
function guardarTransaccion() {
    var tipo = document.getElementById('transactionType').value;
    var cantidad = parseFloat(document.getElementById('transactionAmount').value);
    var categoria = document.getElementById('transactionCategory').value;
    var descripcion = document.getElementById('transactionDescription').value;
    var fecha = document.getElementById('transactionDate').value;

    if (!tipo || !cantidad || !categoria || !descripcion || !fecha) {
        alert('Por favor completa todos los campos.');
        return;
    }

    var transaccion = {
        id: Date.now(),
        type: tipo,
        amount: cantidad,
        category: categoria,
        description: descripcion,
        date: fecha,
        createdAt: new Date().toISOString()
    };

    // Guardarlo en el navegador
    try {
        var transacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
        transacciones.unshift(transaccion); // Ponerlo al principio
        localStorage.setItem('transacciones', JSON.stringify(transacciones));
    } catch(err) {
        console.error('Error al guardar transacción:', err);
        return;
    }

    // Limpiar el formulario
    document.getElementById('transactionForm').reset();
    document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];

    // Cerrar la ventana
    var modal = bootstrap.Modal.getInstance(document.getElementById('transactionModal'));
    modal.hide();

    // Actualizar todo
    cargarTransacciones();
    actualizarDatosFinancieros();

    // Mostrar que se guardó
    mostrarMensajeExito('Transacción guardada exitosamente');
}

// Cargar las transacciones
function cargarTransacciones() {
    try {
        var transacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
        mostrarTransacciones(transacciones.slice(0, 5)); // Solo las últimas 5
    } catch(err) {
        console.error('Error al cargar transacciones:', err);
    }
}

// Poner las transacciones en la tabla
function mostrarTransacciones(transacciones) {
    var tbody = document.getElementById('lastTxBody');
    if (!tbody) return;

    if (transacciones.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No hay transacciones</td></tr>';
        return;
    }

    var html = transacciones.map(function(transaccion) {
        var claseColor = transaccion.type === 'ingreso' ? 'text-success' : 'text-danger';
        var signo = transaccion.type === 'ingreso' ? '+' : '-';
        var fechaFormateada = new Date(transaccion.date).toLocaleDateString('es-ES');
        
        return `
            <tr>
                <td class="transaction-date">${fechaFormateada}</td>
                <td>${transaccion.description}</td>
                <td class="text-end ${claseColor}">${signo}$${transaccion.amount.toLocaleString()}</td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = html;
}

// Calcular el balance y todo eso
function actualizarDatosFinancieros() {
    try {
        var transacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');

        var totalIngresos = 0;
        var totalGastos = 0;

        transacciones.forEach(function(transaccion) {
            if (transaccion.type === 'ingreso') {
                totalIngresos += transaccion.amount;
            } else if (transaccion.type === 'gasto') {
                totalGastos += transaccion.amount;
            }
        });

        var balance = totalIngresos - totalGastos;

        // Actualizar los números en pantalla
        document.getElementById('balanceAmount').textContent = '$' + balance.toLocaleString();
        document.getElementById('incomeAmount').textContent = '$' + totalIngresos.toLocaleString();
        document.getElementById('expenseAmount').textContent = '$' + totalGastos.toLocaleString();

        // Cambiar los colores según si es positivo o negativo
        var elementoBalance = document.getElementById('balanceAmount');
        elementoBalance.className = 'card-value ' + (balance >= 0 ? 'text-success' : 'text-danger');

        // Colores fijos para ingresos y gastos
        document.getElementById('incomeAmount').className = 'card-value text-success';
        document.getElementById('expenseAmount').className = 'card-value text-danger';

        // Actualizar gráficos
        actualizarGraficosDinamicos();

    } catch(err) {
        console.error('Error al actualizar datos financieros:', err);
    }
}

// Actualizar gráficos con datos reales
function actualizarGraficosDinamicos() {
    try {
        var datosGastos = analizarGastosPorCategoria();
        
        // Mapeo de categorías a emojis y colores
        var infoCategoria = {
            'alimentacion': { emoji: '🍔', color: '#FF6B6B', name: 'Alimentación' },
            'transporte': { emoji: '🚗', color: '#4ECDC4', name: 'Transporte' },
            'entretenimiento': { emoji: '🎬', color: '#45B7D1', name: 'Entretenimiento' },
            'compras': { emoji: '🛒', color: '#96CEB4', name: 'Compras' },
            'salario': { emoji: '💰', color: '#FFD93D', name: 'Salario' },
            'otros': { emoji: '📦', color: '#C7C7C7', name: 'Otros' }
        };

        actualizarGraficoDona(datosGastos, infoCategoria);
        actualizarListaCategorias(datosGastos, infoCategoria);
        
    } catch(err) {
        console.error('Error al actualizar gráficos:', err);
    }
}

// Analizar gastos por categoría
function analizarGastosPorCategoria() {
    try {
        var transacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
        var gastosPorCategoria = {};
        var totalGastos = 0;

        // Calcular gastos por categoría
        transacciones.forEach(function(transaccion) {
            if (transaccion.type === 'gasto') {
                var categoria = transaccion.category || 'otros';
                if (!gastosPorCategoria[categoria]) {
                    gastosPorCategoria[categoria] = 0;
                }
                gastosPorCategoria[categoria] += transaccion.amount;
                totalGastos += transaccion.amount;
            }
        });

        // Convertir a array y ordenar por monto
        var arrayCategoria = Object.keys(gastosPorCategoria).map(function(categoria) {
            var porcentaje = totalGastos > 0 ? (gastosPorCategoria[categoria] / totalGastos) * 100 : 0;
            return {
                category: categoria,
                amount: gastosPorCategoria[categoria],
                percentage: Math.round(porcentaje)
            };
        }).sort(function(a, b) {
            return b.amount - a.amount;
        });

        return {
            categories: arrayCategoria,
            totalExpenses: totalGastos
        };
    } catch(err) {
        console.error('Error al analizar gastos:', err);
        return { categories: [], totalExpenses: 0 };
    }
}

// Actualizar gráfico de dona con datos reales
function actualizarGraficoDona(datosGastos, infoCategoria) {
    try {
        var graficoDona = document.getElementById('donutChart');
        var totalDona = document.querySelector('.donut-total');
        var leyendaDona = document.getElementById('donutLegend');
        
        if (!graficoDona || !totalDona) return;

        // Limpiar contenido existente
        graficoDona.innerHTML = '';

        if (datosGastos.categories.length === 0) {
            // Sin gastos - mostrar gráfico vacío
            graficoDona.style.background = 'conic-gradient(#e9ecef 0deg 360deg)';
            totalDona.textContent = '0%';
            if (leyendaDona) leyendaDona.innerHTML = '<p class="text-muted">Sin datos de gastos</p>';
            return;
        }

        // Crear segmentos basados en datos reales
        datosGastos.categories.forEach(function(categoria) {
            var info = infoCategoria[categoria.category] || infoCategoria['otros'];
            var segmento = document.createElement('div');
            segmento.className = 'donut-segment';
            segmento.setAttribute('data-value', Math.round(categoria.percentage));
            segmento.setAttribute('data-label', info.name);
            segmento.style.setProperty('--color', info.color);
            graficoDona.appendChild(segmento);
        });

        // Crear gradiente basado en datos reales
        var partesGradiente = [];
        var gradoActual = 0;

        datosGastos.categories.forEach(function(categoria) {
            var info = infoCategoria[categoria.category] || infoCategoria['otros'];
            var grados = (categoria.percentage / 100) * 360;
            var gradoFinal = gradoActual + grados;
            
            partesGradiente.push(info.color + ' ' + gradoActual + 'deg ' + gradoFinal + 'deg');
            gradoActual = gradoFinal;
        });

        var gradiente = 'conic-gradient(' + partesGradiente.join(', ') + ')';
        graficoDona.style.background = gradiente;
        totalDona.textContent = '100%';

        // Actualizar leyenda de la dona
        if (leyendaDona) {
            var htmlLeyenda = datosGastos.categories.map(function(categoria) {
                var info = infoCategoria[categoria.category] || infoCategoria['otros'];
                return '<div class="legend-item">' +
                       '<div class="legend-color" style="background-color: ' + info.color + ';"></div>' +
                       '<span>' + info.name + ' (' + Math.round(categoria.percentage) + '%)</span>' +
                       '</div>';
            }).join('');
            leyendaDona.innerHTML = htmlLeyenda;
        }

    } catch(err) {
        console.error('Error al actualizar gráfico de dona:', err);
    }
}

// Actualizar lista de categorías con datos reales
function actualizarListaCategorias(datosGastos, infoCategoria) {
    try {
        var listaCategorias = document.querySelector('.categories-list');
        var totalCategorias = document.querySelector('.categories-total strong');
        
        if (!listaCategorias) return;

        if (datosGastos.categories.length === 0) {
            listaCategorias.innerHTML = `
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
            if (totalCategorias) totalCategorias.textContent = '$0';
            return;
        }

        // Mostrar hasta las 4 categorías principales
        var principalesCategorias = datosGastos.categories.slice(0, 4);
        var html = '';

        principalesCategorias.forEach(function(categoria) {
            var info = infoCategoria[categoria.category] || infoCategoria['otros'];
            html += `
                <div class="category-item">
                    <div class="category-icon">${info.emoji}</div>
                    <div class="category-info">
                        <div class="category-name">${info.name}</div>
                        <div class="category-amount">$${categoria.amount.toLocaleString()}</div>
                    </div>
                    <div class="category-bar">
                        <div class="category-fill" style="width: ${categoria.percentage}%; background-color: ${info.color};"></div>
                    </div>
                </div>
            `;
        });

        listaCategorias.innerHTML = html;
        if (totalCategorias) {
            totalCategorias.textContent = '$' + datosGastos.totalExpenses.toLocaleString();
        }

    } catch(err) {
        console.error('Error al actualizar lista de categorías:', err);
    }
}

// Mostrar el mensaje de que se guardó
function mostrarMensajeExito(mensaje) {
    var notificacion = document.createElement('div');
    notificacion.className = 'success-notification';
    notificacion.textContent = mensaje;
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notificacion);
    
    setTimeout(function() {
        notificacion.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(function() {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        }, 300);
    }, 3000);
}

// Función para actualizar contador de tarjetas (llamada desde metodoPago.js)
function actualizarContadorTarjetas() {
    try {
        var tarjetas = JSON.parse(localStorage.getItem('registered_cards') || '[]');
        var contador = document.getElementById('cardsCount');
        if (contador) {
            contador.textContent = tarjetas.length;
        }
    } catch(err) {
        console.error('Error al actualizar contador de tarjetas:', err);
    }
}

// Poner el nombre del usuario en el mensaje de bienvenida del dashboard
function ponerNombreEnDashboard() {
    try {
        var nombreDelUsuario = localStorage.getItem('app_user_name') || 'Usuario';
        var dondeVaElNombreDash = document.getElementById('dashUserName');
        if (dondeVaElNombreDash) {
            dondeVaElNombreDash.textContent = nombreDelUsuario;
        }
    } catch(err) {
        console.error('No pudimos mostrar el nombre en dashboard:', err);
    }
}