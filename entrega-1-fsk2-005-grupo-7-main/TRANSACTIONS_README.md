# 📊 Módulo de Transacciones - BalanceUp

## 🎯 Descripción

El módulo de transacciones permite gestionar ingresos, gastos y simulaciones de compras vinculadas a las tarjetas registradas en el sistema. Está diseñado para ser completamente responsivo y compatible con el modo oscuro.

## ✨ Características Principales

### 🔄 Tipos de Transacciones
- **Ingreso**: Para registrar dinero que entra (salarios, bonos, etc.)
- **Gasto**: Para registrar dinero que sale (compras, servicios, etc.)
- **Simulación de Compra**: Para simular compras con tarjetas específicas

### 💳 Vinculación con Tarjetas
- Las simulaciones de compra se vinculan automáticamente con las tarjetas registradas
- Muestra información de la tarjeta utilizada en el historial
- Solo se muestran tarjetas válidas y activas

### 🎨 Interfaz Responsiva
- Diseño adaptativo para dispositivos móviles y de escritorio
- Compatible con modo oscuro y claro
- Animaciones suaves y transiciones elegantes

## 🚀 Cómo Usar

### 1. Acceder al Módulo
- Navega a la página "Transacciones" desde el sidebar
- O usa el enlace directo: `transactions.html`

### 2. Crear una Transacción

#### Transacción Básica (Ingreso/Gasto)
1. Selecciona el tipo: "Ingreso" o "Gasto"
2. Ingresa el monto
3. Selecciona la categoría
4. Escribe una descripción
5. Selecciona la fecha
6. Haz clic en "Guardar Transacción"

#### Simulación de Compra
1. Selecciona el tipo: "Simulación de Compra"
2. Selecciona la tarjeta a usar
3. Selecciona el tipo de comercio
4. Escribe el nombre del comercio
5. Completa los demás campos
6. Haz clic en "Guardar Transacción"

### 3. Gestionar Transacciones
- **Ver todas**: Muestra todas las transacciones
- **Filtrar por ingresos**: Solo muestra transacciones de ingreso
- **Filtrar por gastos**: Solo muestra transacciones de gasto

## 🔧 Funcionalidades Técnicas

### Validaciones Implementadas
- ✅ Campos obligatorios completos
- ✅ Monto mayor a 0
- ✅ Fecha válida
- ✅ Tarjeta seleccionada para simulaciones
- ✅ Tipo de comercio para simulaciones
- ✅ Nombre de comercio para simulaciones

### Almacenamiento
- Todas las transacciones se guardan en `localStorage`
- Compatible con el sistema existente de transacciones
- Se sincroniza con el dashboard principal

### Integración
- Se integra con el módulo de métodos de pago
- Actualiza automáticamente el dashboard
- Mantiene consistencia con el resto de la aplicación

## 📱 Responsividad

### Breakpoints
- **Desktop**: Layout de 2 columnas (formulario + historial)
- **Tablet**: Layout adaptativo con espaciado optimizado
- **Mobile**: Layout de 1 columna con elementos apilados

### Elementos Adaptativos
- Botones de filtro se ajustan al ancho disponible
- Formularios se optimizan para pantallas pequeñas
- Tarjetas de transacciones se reorganizan automáticamente

## 🌙 Modo Oscuro

### Compatibilidad Total
- Todos los elementos respetan el tema seleccionado
- Colores se adaptan automáticamente
- Transiciones suaves entre modos

### Variables CSS Utilizadas
- `--bg-primary`: Fondo principal
- `--bg-secondary`: Fondo secundario
- `--text-primary`: Texto principal
- `--text-secondary`: Texto secundario
- `--card-bg`: Fondo de tarjetas
- `--border-color`: Color de bordes

## 🎨 Estilos y Animaciones

### Efectos Visuales
- Hover effects en tarjetas de transacciones
- Animaciones de entrada y salida para notificaciones
- Transiciones suaves en botones y formularios

### Colores de Estado
- **Verde** (#28a745): Ingresos y elementos positivos
- **Rojo** (#dc3545): Gastos y elementos negativos
- **Azul** (#007bff): Simulaciones y elementos neutros

## 📁 Estructura de Archivos

```
├── transactions.html          # Página principal del módulo
├── js/
│   └── transactions.js       # Lógica JavaScript del módulo
└── static/style/css/
    └── style.css            # Estilos CSS (incluye estilos de transacciones)
```

## 🔗 Integración con Otros Módulos

### Dashboard
- Las transacciones se reflejan en el balance general
- Se actualiza el contador de transacciones
- Se sincroniza el historial de transacciones

### Métodos de Pago
- Accede a las tarjetas registradas
- Muestra información de tarjetas en simulaciones
- Mantiene consistencia en la gestión de tarjetas

### Analytics
- Las transacciones alimentan los gráficos y estadísticas
- Se incluyen en los cálculos de balance mensual
- Contribuyen a los análisis de gastos por categoría

## 🚨 Solución de Problemas

### Transacciones No Se Guardan
- Verifica que todos los campos obligatorios estén completos
- Revisa la consola del navegador para errores
- Asegúrate de que el localStorage esté habilitado

### Tarjetas No Aparecen
- Verifica que hayas registrado tarjetas en "Métodos de Pago"
- Asegúrate de que las tarjetas estén activas
- Revisa que el localStorage contenga las tarjetas

### Errores de Validación
- Los mensajes de error aparecen en la esquina superior derecha
- Verifica que los campos cumplan con los requisitos
- Asegúrate de seleccionar el tipo de transacción correcto

## 🔮 Próximas Mejoras

### Funcionalidades Planificadas
- [ ] Exportar transacciones a CSV/PDF
- [ ] Categorías personalizables
- [ ] Etiquetas para transacciones
- [ ] Búsqueda y filtros avanzados
- [ ] Notificaciones de transacciones recurrentes

### Mejoras Técnicas
- [ ] Persistencia en base de datos
- [ ] Sincronización en la nube
- [ ] API REST para transacciones
- [ ] Autenticación y autorización
- [ ] Historial de cambios

## 📞 Soporte

Para reportar problemas o sugerir mejoras:
1. Revisa la consola del navegador para errores
2. Verifica que todos los archivos estén presentes
3. Asegúrate de que el localStorage esté habilitado
4. Contacta al equipo de desarrollo con detalles del problema

---

**BalanceUp** - Tu compañero financiero personal 💰
