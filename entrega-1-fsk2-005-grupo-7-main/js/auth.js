// Módulo de Autenticación
// Este archivo maneja el login y registro de usuarios

(function(){
    // Configurar el formulario de login
    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e){
            e.preventDefault();  // Evitar que la página se recargue
            
            // Obtener los datos del formulario
            var email = document.getElementById('loginEmail').value.trim();
            var pass = document.getElementById('loginPassword').value.trim();
            
            // Validar credenciales de demo (sistema simple para estudiantes)
            if (email === 'demo@balanceup.com' && pass === '12345678') {
                try { 
                    // Marcar al usuario como logueado en el navegador
                    localStorage.setItem('demo_logged_in', '1'); 
                } catch(err) {}
                
                // Redirigir a la página principal
                window.location.href = 'index.html';
            } else {
                alert('Credenciales de demo incorrectas. Usa demo@balanceup.com / 12345678');
            }
        });
    }

    // Configurar el formulario de registro
    var regForm = document.getElementById('regForm');
    if (regForm) {
        regForm.addEventListener('submit', function(e){
            e.preventDefault();  // Evitar que la página se recargue
            
            // Obtener todos los datos del formulario
            var name = document.getElementById('regName').value.trim();
            var email = document.getElementById('regEmail').value.trim();
            var pass = document.getElementById('regPassword').value.trim();
            var pass2 = document.getElementById('regPassword2').value.trim();
            
            // Validar que todos los campos estén llenos
            if (!name || !email || !pass || !pass2) {
                alert('Completa todos los campos.');
                return;
            }
            
            // Validar que las contraseñas coincidan
            if (pass !== pass2) {
                alert('Las contraseñas no coinciden.');
                return;
            }
            
            try {
                // Guardar los datos del usuario en el navegador
                localStorage.setItem('app_user_name', name);
                localStorage.setItem('app_user_email', email);
                
                // Marcar al usuario como logueado (sistema simple)
                localStorage.setItem('demo_logged_in', '1');
            } catch(err) {}
            
            // Redirigir a la página principal
            window.location.href = 'index.html';
        });
    }
})();


