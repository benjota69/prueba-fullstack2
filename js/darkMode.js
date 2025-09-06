// JS de dark mode (Cambiar estilo de la página (blanco - negro) )
// 

// Variables para manejar el tema
let temaActual = localStorage.getItem('tema') || 'claro';

// Cuando carga la página, aplicar el tema guardado
document.addEventListener('DOMContentLoaded', function() {
    aplicarTema(temaActual);
});

// Función para cambiar el tema
function cambiarTema() {
    // Cambiar entre claro y oscuro
    temaActual = temaActual === 'claro' ? 'oscuro' : 'claro';
    
    // Aplicar el nuevo tema
    aplicarTema(temaActual);
    
    // Guardar en el navegador
    localStorage.setItem('tema', temaActual);
    
    // Mostrar mensaje
    mostrarCambioTema();
}

// Aplicar el tema a la página
function aplicarTema(tema) {
    if (tema === 'oscuro') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
    
    // Cambiar los iconos del botón
    cambiarIconos(tema);
}

// Cambiar los iconos del botón de tema
function cambiarIconos(tema) {
    const iconoSol = document.querySelector('.dark-mode-toggle .sun-icon');
    const iconoLuna = document.querySelector('.dark-mode-toggle .moon-icon');
    
    // También buscar en los botones de login
    const iconoSollogin = document.querySelector('.dark-mode-toggle-login .sun-icon');
    const iconoLunalogin = document.querySelector('.dark-mode-toggle-login .moon-icon');
    
    if (iconoSol && iconoLuna) {
        if (tema === 'oscuro') {
            iconoSol.style.display = 'inline-block';
            iconoLuna.style.display = 'none';
        } else {
            iconoSol.style.display = 'none';
            iconoLuna.style.display = 'inline-block';
        }
    }
    
    if (iconoSollogin && iconoLunalogin) {
        if (tema === 'oscuro') {
            iconoSollogin.style.display = 'inline-block';
            iconoLunalogin.style.display = 'none';
        } else {
            iconoSollogin.style.display = 'none';
            iconoLunalogin.style.display = 'inline-block';
        }
    }
}

// Mostrar mensaje cuando cambia el tema
function mostrarCambioTema() {
    const mensaje = temaActual === 'oscuro' ? 'Modo oscuro activado 🌙' : 'Modo claro activado ☀️';
    
    // Crear el mensaje
    const notificacion = document.createElement('div');
    notificacion.textContent = mensaje;
    notificacion.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1000;
        font-size: 14px;
    `;
    
    document.body.appendChild(notificacion);
    
    // Quitar el mensaje después de 2 segundos
    setTimeout(() => {
        if (notificacion.parentNode) {
            notificacion.parentNode.removeChild(notificacion);
        }
    }, 2000);
}

// Función que se llama desde los botones HTML
function toggleDarkMode() {
    cambiarTema();
}