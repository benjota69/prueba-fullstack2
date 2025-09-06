// Módulo de Página de Tarjetas (métodos de pago)
// Aquí manejamos todo lo de las tarjetas de crédito/débito (se pueden registrar y eliminar tarjetas)


// Cuando se carga la página, hacer esto
document.addEventListener('DOMContentLoaded', function() {
    cargarTarjetasGuardadas();      
    configurarFormulario();       
});

// Configurar el formulario de tarjetas
function configurarFormulario() {
    const formulario = document.getElementById('cardForm');
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            guardarTarjeta();
        });
    }
    
    // Configurar validaciones
    configurarValidaciones();
}

// Hacer que los campos se validen mientras escribes
function configurarValidaciones() {
    const numeroTarjeta = document.getElementById('cardNumber');
    const fechaVencimiento = document.getElementById('cardExpiry');
    
    if (numeroTarjeta) {
        numeroTarjeta.addEventListener('input', function() {
            arreglarNumeroTarjeta(this);
        });
    }
    
    if (fechaVencimiento) {
        fechaVencimiento.addEventListener('input', function() {
            arreglarFecha(this);
        });
    }
}

// Hacer que el número se vea bonito (1234 5678 9012 3456)
function arreglarNumeroTarjeta(campo) {
    // Quitar todo lo que no sea número
    let valor = campo.value.replace(/[^0-9]/g, '');
    
    // Máximo 16 números
    valor = valor.substring(0, 16);
    
    // Poner espacios cada 4 números
    let valorConEspacios = valor.match(/.{1,4}/g)?.join(' ') || valor;
    
    campo.value = valorConEspacios;
}

// Hacer que la fecha se vea como MM/AA
function arreglarFecha(campo) {
    // Quitar todo lo que no sea número
    let valor = campo.value.replace(/[^0-9]/g, '');
    
    // Máximo 4 números
    valor = valor.substring(0, 4);
    
    // Poner la "/" después de 2 números
    if (valor.length >= 2) {
        valor = valor.substring(0, 2) + '/' + valor.substring(2);
    }
    
    campo.value = valor;
}

// Guardar una nueva tarjeta
function guardarTarjeta() {
    // Obtener los datos del formulario
    const numeroTarjeta = document.getElementById('cardNumber').value;
    const tipoTarjeta = document.getElementById('cardType').value;
    const nombreTitular = document.getElementById('cardHolder').value;
    const fechaVence = document.getElementById('cardExpiry').value;
    const alias = document.getElementById('cardAlias').value;
    const banco = document.getElementById('cardBank').value;
    
    // Revisar que estén todos los datos
    if (!numeroTarjeta || !nombreTitular || !fechaVence || !banco) {
        alert('Faltan datos, por favor llena todos los campos.');
        return;
    }
    
    // Revisar que el número tenga 16 dígitos
    if (numeroTarjeta.replace(/\s/g, '').length < 16) {
        alert('El número de tarjeta debe tener 16 dígitos.');
        return;
    }
    
    // Crear la tarjeta nueva
    const tarjetaNueva = {
        id: Date.now(),  
        number: numeroTarjeta,
        type: tipoTarjeta,
        holder: nombreTitular,
        expiry: fechaVence,
        alias: alias || `${tipoTarjeta.charAt(0).toUpperCase() + tipoTarjeta.slice(1)} ${numeroTarjeta.slice(-4)}`,
        bank: banco,
        registeredAt: new Date().toISOString()
    };
    
    // Guardar en el navegador
    guardarEnNavegador(tarjetaNueva);
    
    // Limpiar el formulario
    document.getElementById('cardForm').reset();
    
    // Actualizar la lista
    cargarTarjetasGuardadas();
    
    // Mostrar mensaje de éxito
    mostrarMensaje('¡Tarjeta guardada exitosamente!');
    
    // Actualizar el contador en el dashboard si está abierto
    if (typeof actualizarContadorTarjetas === 'function') {
        actualizarContadorTarjetas();
    }
}

// Guardar tarjeta en el navegador
function guardarEnNavegador(tarjeta) {
    try {
        let tarjetas = JSON.parse(localStorage.getItem('registered_cards') || '[]');
        tarjetas.push(tarjeta);
        localStorage.setItem('registered_cards', JSON.stringify(tarjetas));
    } catch (error) {
        console.error('Error al guardar tarjeta:', error);
    }
}

// Cargar las tarjetas que ya están guardadas
function cargarTarjetasGuardadas() {
    try {
        const tarjetas = JSON.parse(localStorage.getItem('registered_cards') || '[]');
        mostrarTarjetas(tarjetas);
    } catch (error) {
        console.error('Error al cargar tarjetas:', error);
    }
}

// Mostrar las tarjetas en la página
function mostrarTarjetas(tarjetas) {
    const contenedor = document.getElementById('registeredCards');
    if (!contenedor) return;
    
    if (tarjetas.length === 0) {
        contenedor.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💳</div>
                <p class="empty-text">No tienes tarjetas registradas</p>
                <small class="empty-subtext">Registra tu primera tarjeta para comenzar</small>
            </div>
        `;
        return;
    }
    
    const tarjetasHTML = tarjetas.map(tarjeta => `
        <div class="registered-card">
            <div class="card-info">
                <div class="card-header">
                    <span class="card-alias">${tarjeta.alias}</span>
                    <span class="card-type">${tarjeta.type === 'credito' ? 'Crédito' : 'Débito'}</span>
                </div>
                <div class="card-details">
                    <div class="card-number">•••• •••• •••• ${tarjeta.number.slice(-4)}</div>
                    <div class="card-holder">${tarjeta.holder}</div>
                    <div class="card-expiry">Vence: ${tarjeta.expiry}</div>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarTarjeta(${tarjeta.id})">
                    <span>🗑️</span>
                </button>
            </div>
        </div>
    `).join('');
    
    contenedor.innerHTML = tarjetasHTML;
}

// Eliminar una tarjeta
function eliminarTarjeta(idTarjeta) {
    // Preguntar si está seguro
    if (confirm('¿Estás seguro de que quieres eliminar esta tarjeta?')) {
        try {
            // Obtener todas las tarjetas
            let tarjetas = JSON.parse(localStorage.getItem('registered_cards') || '[]');
            
            // Quitar la que queremos eliminar
            tarjetas = tarjetas.filter(tarjeta => tarjeta.id !== idTarjeta);
            
            // Guardar las tarjetas actualizadas
            localStorage.setItem('registered_cards', JSON.stringify(tarjetas));
            
            // Actualizar la lista
            cargarTarjetasGuardadas();
            
            // Mostrar mensaje
            mostrarMensaje('Tarjeta eliminada');
            
            // Actualizar el contador en el dashboard si está abierto
            if (typeof actualizarContadorTarjetas === 'function') {
                actualizarContadorTarjetas();
            }
        } catch (error) {
            console.error('Error al eliminar tarjeta:', error);
        }
    }
}

// Mostrar mensaje al usuario
function mostrarMensaje(mensaje) {
    const notificacion = document.createElement('div');
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
    
    setTimeout(() => {
        notificacion.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        }, 300);
    }, 3000);
}