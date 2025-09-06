// Módulo de Sidebar
// Este archivo maneja la funcionalidad del sidebar y hamburguesa en todas las páginas
// Se hizo un JS aparte llamado sidebar SOLAMENTE para la barra lateral ya que así se
// optimiza codigo y así no es necesario poner el mismo pedazo de código en todos los JS.

(function(){
    // Función para alternar el sidebar
    function toggleSidebar() {
        const barraLateral = document.getElementById('sidebar');
        const botonHamburguesa = document.querySelector('.hamburger-menu');
        const contenedorPrincipal = document.querySelector('.app-container');
        
        if (barraLateral && botonHamburguesa) {
            // En la página index (que tiene index-container) o en móviles
            if ((contenedorPrincipal && contenedorPrincipal.classList.contains('index-container')) || window.innerWidth <= 768) {
                barraLateral.classList.toggle('active');
                botonHamburguesa.classList.toggle('active');
            }
        }
    }

    // Función para cerrar el sidebar
    function cerrarBarraLateral() {
        const barraLateral = document.getElementById('sidebar');
        const botonHamburguesa = document.querySelector('.hamburger-menu');
        const contenedorPrincipal = document.querySelector('.app-container');
        
        if (barraLateral && botonHamburguesa) {
            // Cerrar en la página index o en móviles
            if ((contenedorPrincipal && contenedorPrincipal.classList.contains('index-container')) || window.innerWidth <= 768) {
                barraLateral.classList.remove('active');
                botonHamburguesa.classList.remove('active');
            }
        }
    }

    // Función para configurar los event listeners del sidebar
    function configurarEventosDelSidebar() {
        const contenedorPrincipal = document.querySelector('.app-container');
        
        // Configurar listeners en la página index o en móviles
        if ((contenedorPrincipal && contenedorPrincipal.classList.contains('index-container')) || window.innerWidth <= 768) {
            // Cerrar sidebar al hacer clic fuera
            document.addEventListener('click', function(evento) {
                const barraLateral = document.getElementById('sidebar');
                const botonHamburguesa = document.querySelector('.hamburger-menu');
                
                if (barraLateral && botonHamburguesa) {
                    if (!barraLateral.contains(evento.target) && !botonHamburguesa.contains(evento.target)) {
                        cerrarBarraLateral();
                    }
                }
            });

            // Cerrar sidebar con tecla Escape
            document.addEventListener('keydown', function(evento) {
                if (evento.key === 'Escape') {
                    cerrarBarraLateral();
                }
            });

            // Cerrar sidebar al hacer clic en enlaces del menú
            document.querySelectorAll('.sidebar-menu a').forEach(function(enlace) {
                enlace.addEventListener('click', function() {
                    cerrarBarraLateral();
                });
            });
        }
    }

    // Función para agregar el botón hamburguesa al HTML si no existe
    function agregarBotonHamburguesa() {
        // Verificar si ya existe el botón hamburguesa
        if (document.querySelector('.hamburger-menu')) {
            return;
        }

        // Crear el botón hamburguesa
        const botonHamburguesa = document.createElement('button');
        botonHamburguesa.className = 'hamburger-menu';
        botonHamburguesa.setAttribute('onclick', 'toggleSidebar()');
        botonHamburguesa.setAttribute('title', 'Menú');
        
        // Agregar las líneas del hamburguesa
        for (let contador = 0; contador < 3; contador++) {
            const lineaDelBoton = document.createElement('span');
            lineaDelBoton.className = 'hamburger-line';
            botonHamburguesa.appendChild(lineaDelBoton);
        }

        // Insertar el botón al inicio del body
        document.body.insertBefore(botonHamburguesa, document.body.firstChild);
    }

    // Función para hacer toggleSidebar globalmente accesible
    window.toggleSidebar = toggleSidebar;
    
    // Ejecutar cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', function() {
        agregarBotonHamburguesa();
        configurarEventosDelSidebar();
    });
})();