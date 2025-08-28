(function(){
    // Login de demo
    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e){
            e.preventDefault();
            var email = document.getElementById('loginEmail').value.trim();
            var pass = document.getElementById('loginPassword').value.trim();
            if (email === 'demo@balanceup.com' && pass === '12345678') {
                try { localStorage.setItem('demo_logged_in', '1'); } catch(err) {}
                window.location.href = 'index.html';
            } else {
                alert('Credenciales de demo incorrectas. Usa demo@balanceup.com / 12345678');
            }
        });
    }

    // Registro simple: guarda nombre y correo en localStorage
    var regForm = document.getElementById('regForm');
    if (regForm) {
        regForm.addEventListener('submit', function(e){
            e.preventDefault();
            var name = document.getElementById('regName').value.trim();
            var email = document.getElementById('regEmail').value.trim();
            var pass = document.getElementById('regPassword').value.trim();
            var pass2 = document.getElementById('regPassword2').value.trim();
            if (!name || !email || !pass || !pass2) {
                alert('Completa todos los campos.');
                return;
            }
            if (pass !== pass2) {
                alert('Las contraseñas no coinciden.');
                return;
            }
            try {
                localStorage.setItem('app_user_name', name);
                localStorage.setItem('app_user_email', email);
                // Marca una "sesión" simple
                localStorage.setItem('demo_logged_in', '1');
            } catch(err) {}
            window.location.href = 'index.html';
        });
    }
})();


