(function(){
    // Lee el nombre guardado y muestra "Bienvenido, {nombre}"
    var title = document.getElementById('welcomeTitle');
    if (!title) return;
    var name = '';
    try { name = localStorage.getItem('app_user_name') || ''; } catch(err) {}
    if (name) {
        title.textContent = 'Bienvenido, ' + name;
    } else {
        title.textContent = 'Bienvenido';
    }
})();


