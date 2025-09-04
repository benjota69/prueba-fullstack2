// Módulo de la página de inicio
// Este archivo maneja la página principal después del login

(function(){
    // Leer el nombre del usuario guardado y mostrar mensaje personalizado
    var title = document.getElementById('welcomeTitle');
    if (!title) return;
    
    var name = '';
    try { 
        // Obtener el nombre del usuario del localStorage
        name = localStorage.getItem('app_user_name') || ''; 
    } catch(err) {}
    
    // Mostrar mensaje personalizado si hay nombre guardado
    if (name) {
        title.textContent = 'Bienvenido, ' + name;
    } else {
        title.textContent = 'Bienvenido';
    }
})();


