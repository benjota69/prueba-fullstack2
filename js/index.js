// Módulo de la página de inicio
// Este archivo maneja la página principal después del login (da la bienvenida solamente)

(function(){
    // Función para actualizar el nombre del usuario en la página de inicio
    function ponerNombreEnBienvenida() {
        const welcomeUserName = document.getElementById('welcomeUserName');
        const userName = document.getElementById('userName');
        
        let nombreDelUsuario = 'Usuario';
        try { 
            // Obtener el nombre del usuario del localStorage
            nombreDelUsuario = localStorage.getItem('app_user_name') || 'Usuario';
        } catch(err) {
            console.error('Error al obtener nombre del usuario:', err);
        }
        
        // Actualizar el nombre en la página de bienvenida
        if (welcomeUserName) {
            welcomeUserName.textContent = nombreDelUsuario;
        }
        
        // Actualizar el nombre en el sidebar
        if (userName) {
            userName.textContent = nombreDelUsuario;
        }
    }
    
    // Ejecutar cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', function() {
        ponerNombreEnBienvenida();
        
        // Asegurar que el nombre se cargue correctamente
        setTimeout(function() {
            ponerNombreEnBienvenida();
        }, 100);
    });
})();


