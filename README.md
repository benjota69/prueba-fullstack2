# BalanceUp

Proyecto Fullstack II  
Asignatura: Desarrollo Fullstack II  
Profesor: Gabriel Gobrier  

---

## Integrantes
- Benjamín Nabi Briceño Astudillo  
- Bastián Ignacio Matus Rojas  

---

## Descripción
BalanceUp es una aplicación web y móvil enfocada en la gestión de finanzas personales. Permite a los usuarios registrar ingresos y egresos, calcular automáticamente el balance mensual, visualizar estadísticas con filtros y establecer metas de ahorro.  

Está orientada a estudiantes, trabajadores y pequeños emprendedores que buscan mejorar su educación financiera y adquirir hábitos de consumo más responsables.

---

## Propósito
- Promover la conciencia financiera.  
- Fomentar hábitos de consumo saludables.  
- Reducir la ansiedad asociada al manejo económico.  
- Entregar mayor control al usuario sobre sus recursos.  

---

## Tecnologías
- **Backend:** Java 17, Spring Boot 3 (Spring Web, Spring Data JPA, Spring Security con JWT), Lombok  
- **Base de datos:** MySQL  
- **Documentación:** OpenAPI / Swagger  
- **Repositorio:** GitHub  
- **Opcional a futuro:** Docker para despliegue en cloud  

---

## Arquitectura de Microservicios (Spring Boot, sin gateway)
- **login-service:** creación de cuentas, inicio de sesión y emisión de token JWT  
  Tablas: *users*, *roles*  

- **transaction-service:** gestión de ingresos y egresos, clasificación por categorías  
  Tablas: *transactions*, *categories*  

- **goal-service:** administración de metas de ahorro y progreso  
  Tablas: *goals*, *goal_progress*  

- **analisis-service:** cálculo de balance mensual y distribución de gastos por categoría a partir de las transacciones  

Cada servicio cuenta con su propia base de datos en MySQL para asegurar independencia y escalabilidad.
