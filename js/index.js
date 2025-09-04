// Módulo de la página de inicio
// Este archivo maneja la página principal después del login

(function(){
    // Función para actualizar el nombre del usuario en la página de inicio
    function updateWelcomeName() {
        const welcomeUserName = document.getElementById('welcomeUserName');
        const userName = document.getElementById('userName');
        
        let name = 'Usuario';
        try { 
            // Obtener el nombre del usuario del localStorage
            name = localStorage.getItem('app_user_name') || 'Usuario';
        } catch(err) {
            console.error('Error al obtener nombre del usuario:', err);
        }
        
        // Actualizar el nombre en la página de bienvenida
        if (welcomeUserName) {
            welcomeUserName.textContent = name;
        }
        
        // Actualizar el nombre en el sidebar
        if (userName) {
            userName.textContent = name;
        }
    }
    
    // Ejecutar cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', function() {
        updateWelcomeName();
        
        // Asegurar que el nombre se cargue correctamente
        setTimeout(function() {
            updateWelcomeName();
        }, 100);
    });
})();


