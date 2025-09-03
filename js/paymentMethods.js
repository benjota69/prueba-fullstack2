// Módulo de Métodos de Pago - BalanceUp
document.addEventListener('DOMContentLoaded', function() {
    // Cargar tarjetas guardadas
    loadRegisteredCards();
    
    // Event listeners para el formulario
    setupFormListeners();
    
    // Event listeners para la tarjeta visual
    setupCardVisualListeners();
});

// Configurar listeners del formulario
function setupFormListeners() {
    const form = document.getElementById('cardForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            registerCard();
        });
    }
}

// Configurar listeners para la tarjeta visual
function setupCardVisualListeners() {
    const cardNumber = document.getElementById('cardNumber');
    const cardHolder = document.getElementById('cardHolder');
    const cardExpiry = document.getElementById('cardExpiry');
    
    if (cardNumber) {
        cardNumber.addEventListener('input', function() {
            formatCardNumber(this);
            updateCardVisual();
        });
    }
    
    if (cardHolder) {
        cardHolder.addEventListener('input', function() {
            updateCardVisual();
        });
    }
    
    if (cardExpiry) {
        cardExpiry.addEventListener('input', function() {
            formatExpiry(this);
            updateCardVisual();
        });
    }
}

// Formatear número de tarjeta
function formatCardNumber(input) {
    let value = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    input.value = formattedValue;
}

// Formatear fecha de vencimiento
function formatExpiry(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    input.value = value;
}

// Actualizar tarjeta visual
function updateCardVisual() {
    const cardNumber = document.getElementById('cardNumber').value;
    const cardHolder = document.getElementById('cardHolder').value;
    const cardExpiry = document.getElementById('cardExpiry').value;
    
    const cardNumberDisplay = document.getElementById('cardNumberDisplay');
    const cardHolderDisplay = document.getElementById('cardHolderDisplay');
    const cardExpiryDisplay = document.getElementById('cardExpiryDisplay');
    
    if (cardNumberDisplay) {
        cardNumberDisplay.textContent = cardNumber || '•••• •••• •••• ••••';
    }
    
    if (cardHolderDisplay) {
        cardHolderDisplay.textContent = cardHolder.toUpperCase() || 'NOMBRE APELLIDO';
    }
    
    if (cardExpiryDisplay) {
        cardExpiryDisplay.textContent = cardExpiry || 'MM/AA';
    }
}

// Registrar nueva tarjeta
function registerCard() {
    const cardNumber = document.getElementById('cardNumber').value;
    const cardType = document.getElementById('cardType').value;
    const cardHolder = document.getElementById('cardHolder').value;
    const cardExpiry = document.getElementById('cardExpiry').value;
    const cardAlias = document.getElementById('cardAlias').value;
    const cardBank = document.getElementById('cardBank').value;
    
    // Validaciones básicas
    if (!cardNumber || !cardHolder || !cardExpiry || !cardBank) {
        alert('Por favor completa todos los campos obligatorios.');
        return;
    }
    
    if (cardNumber.replace(/\s/g, '').length < 16) {
        alert('El número de tarjeta debe tener al menos 16 dígitos.');
        return;
    }
    
    // Crear objeto de tarjeta
    const newCard = {
        id: Date.now(),
        number: cardNumber,
        type: cardType,
        holder: cardHolder,
        expiry: cardExpiry,
        alias: cardAlias || `${cardType.charAt(0).toUpperCase() + cardType.slice(1)} ${cardNumber.slice(-4)}`,
        bank: cardBank,
        registeredAt: new Date().toISOString()
    };
    
    // Guardar en localStorage
    saveCard(newCard);
    
    // Limpiar formulario
    document.getElementById('cardForm').reset();
    updateCardVisual();
    
    // Recargar lista de tarjetas
    loadRegisteredCards();
    
    // Mostrar mensaje de éxito
    showSuccessMessage('Tarjeta registrada exitosamente');
    
    // Actualizar dashboard si está abierto
    if (typeof updateCardsCount === 'function') {
        updateCardsCount();
    }
}

// Guardar tarjeta en localStorage
function saveCard(card) {
    try {
        let cards = JSON.parse(localStorage.getItem('registered_cards') || '[]');
        cards.push(card);
        localStorage.setItem('registered_cards', JSON.stringify(cards));
    } catch (error) {
        console.error('Error al guardar tarjeta:', error);
    }
}

// Cargar tarjetas registradas
function loadRegisteredCards() {
    try {
        const cards = JSON.parse(localStorage.getItem('registered_cards') || '[]');
        displayRegisteredCards(cards);
    } catch (error) {
        console.error('Error al cargar tarjetas:', error);
    }
}

// Mostrar tarjetas registradas
function displayRegisteredCards(cards) {
    const container = document.getElementById('registeredCards');
    if (!container) return;
    
    if (cards.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💳</div>
                <p class="empty-text">No tienes tarjetas registradas</p>
                <small class="empty-subtext">Registra tu primera tarjeta para comenzar</small>
            </div>
        `;
        return;
    }
    
    const cardsHTML = cards.map(card => `
        <div class="registered-card">
            <div class="card-info">
                <div class="card-header">
                    <span class="card-alias">${card.alias}</span>
                    <span class="card-type">${card.type === 'credito' ? 'Crédito' : 'Débito'}</span>
                </div>
                <div class="card-details">
                    <div class="card-number">•••• •••• •••• ${card.number.slice(-4)}</div>
                    <div class="card-holder">${card.holder}</div>
                    <div class="card-expiry">Vence: ${card.expiry}</div>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn btn-sm btn-outline-danger" onclick="deleteCard(${card.id})">
                    <span>🗑️</span>
                </button>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = cardsHTML;
}

// Eliminar tarjeta
function deleteCard(cardId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarjeta?')) {
        try {
            let cards = JSON.parse(localStorage.getItem('registered_cards') || '[]');
            cards = cards.filter(card => card.id !== cardId);
            localStorage.setItem('registered_cards', JSON.stringify(cards));
            loadRegisteredCards();
            showSuccessMessage('Tarjeta eliminada exitosamente');
            
            // Actualizar dashboard si está abierto
            if (typeof updateCardsCount === 'function') {
                updateCardsCount();
            }
        } catch (error) {
            console.error('Error al eliminar tarjeta:', error);
        }
    }
}

// Mostrar mensaje de éxito
function showSuccessMessage(message) {
    const notification = document.createElement('div');
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
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}
