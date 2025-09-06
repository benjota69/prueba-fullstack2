// Funciones que se usarán en todas las paginas (modulos)
// Las funciones basicamente son cuando se verifica que se sale, revisa si está logeado, y muestra el nombre en el sidebar

// Función para salir de la aplicación
function salirDeLaApp() {
    try { 
        localStorage.removeItem('demo_logged_in'); 
    } catch(err) {}
    window.location.href = 'login.html';
}

// Revisar si el usuario ya hizo login
function revisarSiEstaLogueado() {
    try {
        var yaEntro = localStorage.getItem('demo_logged_in');
        if (!yaEntro) {
            window.location.href = 'login.html';
        }
    } catch(err) {}
}

// Poner el nombre del usuario en el sidebar
function ponerNombreEnSidebar() {
    try {
        var nombreDelUsuario = localStorage.getItem('app_user_name') || 'Usuario';
        var dondeVaElNombre = document.getElementById('userName');
        if (dondeVaElNombre) {
            dondeVaElNombre.textContent = nombreDelUsuario;
        }
    } catch(err) {
        console.error('No pudimos mostrar el nombre:', err);
    }
}

// Cuando se carga la página, hacer esto
document.addEventListener('DOMContentLoaded', function() {
    revisarSiEstaLogueado();
    ponerNombreEnSidebar();
});