// Módulo de Funciones Comunes
// Este archivo contiene funciones compartidas entre todas las páginas

// Función para cerrar sesión
function logout() {
    try { 
        localStorage.removeItem('demo_logged_in'); 
    } catch(err) {}
    window.location.href = 'login.html';
}

// Verificar si el usuario está logueado (protección básica)
function checkAuth() {
    try {
        var logged = localStorage.getItem('demo_logged_in');
        if (!logged) {
            window.location.href = 'login.html';
        }
    } catch(err) {}
}

// Actualizar nombre del usuario en el sidebar
function updateUserName() {
    try {
        var userName = localStorage.getItem('app_user_name') || 'Usuario';
        var userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = userName;
        }
    } catch(err) {
        console.error('Error al cargar nombre de usuario:', err);
    }
}

// Inicializar funciones comunes cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    updateUserName();
});
