// Módulo de Autenticación (login y registro)
// Este archivo maneja el login y registro de usuarios y la validación de datos de usuario
// Almacena los datos ingresados en el registro así usando LocalStorage

(function(){
    // Funciones de validación
    function validarNombre(nombre) {
        if (!nombre || nombre.length < 2) {
            return {
                esValido: false,
                mensaje: 'El nombre debe tener al menos 2 caracteres.'
            };
        }
        if (nombre.length > 50) {
            return {
                esValido: false,
                mensaje: 'El nombre no puede tener más de 50 caracteres.'
            };
        }
        return { esValido: true };
    }

    function validarEmail(correo) {
        if (!correo) {
            return {
                esValido: false,
                mensaje: 'El email es requerido.'
            };
        }
        
        // Verificar que contenga @
        if (!correo.includes('@')) {
            return {
                esValido: false,
                mensaje: 'El email debe contener el símbolo @.'
            };
        }
        
        // Verificar que termine con .com o .cl
        if (!correo.endsWith('.com') && !correo.endsWith('.cl')) {
            return {
                esValido: false,
                mensaje: 'El email debe terminar con .com o .cl'
            };
        }
        
        // Verificar formato básico de email
        const expresionEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!expresionEmail.test(correo)) {
            return {
                esValido: false,
                mensaje: 'El formato del email no es válido.'
            };
        }
        
        return { esValido: true };
    }
    // Configurar el formulario de login
    var formularioLogin = document.getElementById('loginForm');
    if (formularioLogin) {
        formularioLogin.addEventListener('submit', function(evento){
            evento.preventDefault();  // Evitar que la página se recargue
            
            // Obtener los datos del formulario
            var correo = document.getElementById('loginEmail').value.trim();
            var contrasena = document.getElementById('loginPassword').value.trim();
            
            // Validar email
            var validacionCorreo = validarEmail(correo);
            if (!validacionCorreo.esValido) {
                alert(validacionCorreo.mensaje);
                return;
            }
            
            // Buscar usuario registrado en el navegador
            try {
                var usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios_registrados') || '[]');
                var usuarioEncontrado = usuariosRegistrados.find(function(usuario) {
                    return usuario.email === correo && usuario.password === contrasena;
                });
                
                if (usuarioEncontrado) {
                    // Usuario válido - iniciar sesión
                    localStorage.setItem('demo_logged_in', '1');
                    localStorage.setItem('app_user_name', usuarioEncontrado.name);
                    localStorage.setItem('app_user_email', usuarioEncontrado.email);
                    
                    // Redirigir a la página principal
                    window.location.href = 'index.html';
                } else {
                    alert('Credenciales incorrectas. Si no tienes cuenta, regístrate primero.');
                }
            } catch(error) {
                alert('Error al validar credenciales. Inténtalo de nuevo.');
            }
        });
    }

    // Configurar el formulario de registro
    var formularioRegistro = document.getElementById('regForm');
    if (formularioRegistro) {
        formularioRegistro.addEventListener('submit', function(evento){
            evento.preventDefault();  // Evitar que la página se recargue
            
            // Obtener todos los datos del formulario
            var nombre = document.getElementById('regName').value.trim();
            var correo = document.getElementById('regEmail').value.trim();
            var contrasena = document.getElementById('regPassword').value.trim();
            var contrasena2 = document.getElementById('regPassword2').value.trim();
            
            // Validar nombre
            var validacionNombre = validarNombre(nombre);
            if (!validacionNombre.esValido) {
                alert(validacionNombre.mensaje);
                return;
            }
            
            // Validar email
            var validacionCorreo = validarEmail(correo);
            if (!validacionCorreo.esValido) {
                alert(validacionCorreo.mensaje);
                return;
            }
            
            // Validar que todos los campos estén llenos
            if (!nombre || !correo || !contrasena || !contrasena2) {
                alert('Completa todos los campos.');
                return;
            }
            
            // Validar que las contraseñas coincidan
            if (contrasena !== contrasena2) {
                alert('Las contraseñas no coinciden.');
                return;
            }
            
            // Validar longitud mínima de contraseña
            if (contrasena.length < 6) {
                alert('La contraseña debe tener al menos 6 caracteres.');
                return;
            }
            
            try {
                // Obtener usuarios existentes
                var usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios_registrados') || '[]');
                
                // Verificar si el email ya existe
                var correoExiste = usuariosRegistrados.some(function(usuario) {
                    return usuario.email === correo;
                });
                
                if (correoExiste) {
                    alert('Este email ya está registrado. Intenta con otro o inicia sesión.');
                    return;
                }
                
                // Agregar nuevo usuario
                var nuevoUsuario = {
                    name: nombre,
                    email: correo,
                    password: contrasena, // En un proyecto real esto debería estar encriptado
                    registeredAt: new Date().toISOString()
                };
                
                usuariosRegistrados.push(nuevoUsuario);
                
                // Guardar la lista actualizada
                localStorage.setItem('usuarios_registrados', JSON.stringify(usuariosRegistrados));
                
                // Guardar datos del usuario actual
                localStorage.setItem('app_user_name', nombre);
                localStorage.setItem('app_user_email', correo);
                
                // Marcar al usuario como logueado
                localStorage.setItem('demo_logged_in', '1');
                
                alert('¡Registro exitoso! Bienvenido a BalanceUp.');
                
                // Redirigir a la página principal
                window.location.href = 'index.html';
                
            } catch(error) {
                alert('Error al registrar usuario. Inténtalo de nuevo.');
                return;
            }
        });
    }
})();


