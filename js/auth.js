// Módulo de Autenticación
// Este archivo maneja el login y registro de usuarios

(function(){
    // Funciones de validación
    function validateName(name) {
        if (!name || name.length < 2) {
            return {
                isValid: false,
                message: 'El nombre debe tener al menos 2 caracteres.'
            };
        }
        if (name.length > 50) {
            return {
                isValid: false,
                message: 'El nombre no puede tener más de 50 caracteres.'
            };
        }
        return { isValid: true };
    }

    function validateEmail(email) {
        if (!email) {
            return {
                isValid: false,
                message: 'El email es requerido.'
            };
        }
        
        // Verificar que contenga @
        if (!email.includes('@')) {
            return {
                isValid: false,
                message: 'El email debe contener el símbolo @.'
            };
        }
        
        // Verificar que termine con .com o .cl
        if (!email.endsWith('.com') && !email.endsWith('.cl')) {
            return {
                isValid: false,
                message: 'El email debe terminar con .com o .cl'
            };
        }
        
        // Verificar formato básico de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                isValid: false,
                message: 'El formato del email no es válido.'
            };
        }
        
        return { isValid: true };
    }
    // Configurar el formulario de login
    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e){
            e.preventDefault();  // Evitar que la página se recargue
            
            // Obtener los datos del formulario
            var email = document.getElementById('loginEmail').value.trim();
            var pass = document.getElementById('loginPassword').value.trim();
            
            // Validar email
            var emailValidation = validateEmail(email);
            if (!emailValidation.isValid) {
                alert(emailValidation.message);
                return;
            }
            
            // Validar credenciales de demo (sistema simple para estudiantes)
            if (email === 'demo@balanceup.com' && pass === '12345678') {
                try { 
                    // Marcar al usuario como logueado en el navegador
                    localStorage.setItem('demo_logged_in', '1');
                    // Guardar nombre de demo
                    localStorage.setItem('app_user_name', 'Usuario Demo');
                    localStorage.setItem('app_user_email', email);
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
            
            // Validar nombre
            var nameValidation = validateName(name);
            if (!nameValidation.isValid) {
                alert(nameValidation.message);
                return;
            }
            
            // Validar email
            var emailValidation = validateEmail(email);
            if (!emailValidation.isValid) {
                alert(emailValidation.message);
                return;
            }
            
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


