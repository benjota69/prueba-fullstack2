// Módulo de Sidebar
// Este archivo maneja la funcionalidad del sidebar y hamburguesa en todas las páginas

(function(){
    // Función para alternar el sidebar
    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const hamburger = document.querySelector('.hamburger-menu');
        const appContainer = document.querySelector('.app-container');
        
        if (sidebar && hamburger) {
            // En la página index (que tiene index-container) o en móviles
            if ((appContainer && appContainer.classList.contains('index-container')) || window.innerWidth <= 768) {
                sidebar.classList.toggle('active');
                hamburger.classList.toggle('active');
            }
        }
    }

    // Función para cerrar el sidebar
    function closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const hamburger = document.querySelector('.hamburger-menu');
        const appContainer = document.querySelector('.app-container');
        
        if (sidebar && hamburger) {
            // Cerrar en la página index o en móviles
            if ((appContainer && appContainer.classList.contains('index-container')) || window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    }

    // Función para configurar los event listeners del sidebar
    function setupSidebarListeners() {
        const appContainer = document.querySelector('.app-container');
        
        // Configurar listeners en la página index o en móviles
        if ((appContainer && appContainer.classList.contains('index-container')) || window.innerWidth <= 768) {
            // Cerrar sidebar al hacer clic fuera
            document.addEventListener('click', function(event) {
                const sidebar = document.getElementById('sidebar');
                const hamburger = document.querySelector('.hamburger-menu');
                
                if (sidebar && hamburger) {
                    if (!sidebar.contains(event.target) && !hamburger.contains(event.target)) {
                        closeSidebar();
                    }
                }
            });

            // Cerrar sidebar con tecla Escape
            document.addEventListener('keydown', function(event) {
                if (event.key === 'Escape') {
                    closeSidebar();
                }
            });

            // Cerrar sidebar al hacer clic en enlaces del menú
            document.querySelectorAll('.sidebar-menu a').forEach(function(link) {
                link.addEventListener('click', function() {
                    closeSidebar();
                });
            });
        }
    }

    // Función para agregar el botón hamburguesa al HTML si no existe
    function addHamburgerButton() {
        // Verificar si ya existe el botón hamburguesa
        if (document.querySelector('.hamburger-menu')) {
            return;
        }

        // Crear el botón hamburguesa
        const hamburgerButton = document.createElement('button');
        hamburgerButton.className = 'hamburger-menu';
        hamburgerButton.setAttribute('onclick', 'toggleSidebar()');
        hamburgerButton.setAttribute('title', 'Menú');
        
        // Agregar las líneas del hamburguesa
        for (let i = 0; i < 3; i++) {
            const line = document.createElement('span');
            line.className = 'hamburger-line';
            hamburgerButton.appendChild(line);
        }

        // Insertar el botón al inicio del body
        document.body.insertBefore(hamburgerButton, document.body.firstChild);
    }

    // Función para hacer toggleSidebar globalmente accesible
    window.toggleSidebar = toggleSidebar;
    
    // Ejecutar cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', function() {
        addHamburgerButton();
        setupSidebarListeners();
    });
})();
