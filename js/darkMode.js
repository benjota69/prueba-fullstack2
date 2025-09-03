// Sistema de Dark Mode para BalanceUp
class DarkModeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // Aplicar tema guardado
        this.applyTheme(this.theme);
        
        // Agregar listener para cambios de preferencia del sistema
        this.addSystemPreferenceListener();
    }

    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.theme);
        localStorage.setItem('theme', this.theme);
        
        // Mostrar notificación
        this.showThemeNotification();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Actualizar iconos del botón
        this.updateButtonIcons(theme);
        
        // Actualizar meta theme-color para móviles
        this.updateMetaThemeColor(theme);
    }

    updateButtonIcons(theme) {
        const sunIcon = document.querySelector('.dark-mode-toggle .sun-icon');
        const moonIcon = document.querySelector('.dark-mode-toggle .moon-icon');
        
        if (sunIcon && moonIcon) {
            if (theme === 'dark') {
                sunIcon.style.display = 'inline-block';
                moonIcon.style.display = 'none';
            } else {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'inline-block';
            }
        }
    }

    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = theme === 'dark' ? '#2a2a2a' : '#ffffff';
    }

    addSystemPreferenceListener() {
        // Detectar preferencia del sistema
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            mediaQuery.addEventListener('change', (e) => {
                // Solo cambiar automáticamente si no hay tema guardado
                if (!localStorage.getItem('theme')) {
                    this.theme = e.matches ? 'dark' : 'light';
                    this.applyTheme(this.theme);
                }
            });
        }
    }

    showThemeNotification() {
        const theme = this.theme;
        const message = theme === 'dark' ? 'Modo oscuro activado' : 'Modo claro activado';
        const icon = theme === 'dark' ? '🌙' : '☀️';
        
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = 'theme-notification';
        notification.innerHTML = `
            <span class="theme-icon">${icon}</span>
            <span class="theme-text">${message}</span>
        `;
        
        // Estilos de la notificación
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px var(--shadow-color);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            animation: slideInRight 0.3s ease-out;
            max-width: 250px;
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

    // Método para obtener el tema actual
    getCurrentTheme() {
        return this.theme;
    }

    // Método para verificar si está en modo oscuro
    isDarkMode() {
        return this.theme === 'dark';
    }
}

// Inicializar el manager cuando el DOM esté listo
let darkModeManager;

document.addEventListener('DOMContentLoaded', function() {
    darkModeManager = new DarkModeManager();
});

// Función global para toggle (llamada desde HTML)
function toggleDarkMode() {
    if (darkModeManager) {
        darkModeManager.toggle();
    }
}

// Función para obtener el tema actual
function getCurrentTheme() {
    return darkModeManager ? darkModeManager.getCurrentTheme() : 'light';
}

// Función para verificar si está en modo oscuro
function isDarkMode() {
    return darkModeManager ? darkModeManager.isDarkMode() : false;
}

// Agregar estilos de animación para las notificaciones
const darkModeStyles = document.createElement('style');
darkModeStyles.textContent = `
    @keyframes slideInRight {
        from { 
            transform: translateX(100%); 
            opacity: 0; 
        }
        to { 
            transform: translateX(0); 
            opacity: 1; 
        }
    }
    
    @keyframes slideOutRight {
        from { 
            transform: translateX(0); 
            opacity: 1; 
        }
        to { 
            transform: translateX(100%); 
            opacity: 0; 
        }
    }

    .theme-notification .theme-icon {
        font-size: 16px;
    }

    .theme-notification .theme-text {
        font-weight: 500;
    }
`;

document.head.appendChild(darkModeStyles);
