# BalanceUp

Proyecto **Fullstack II**  
Asignatura: Desarrollo Fullstack II  
Profesor: Gabriel Gobrier

---

## 👥 Integrantes
- **Benjamín Nabi Briceño Astudillo**  
- **Bastián Ignacio Matus Rojas**

---

## 🚀 Descripción
BalanceUp es una aplicación web y móvil diseñada para ayudar a las personas a tomar el control de sus finanzas personales de forma **simple, visual y accesible**.  

La app permite:
- Registrar ingresos y egresos.
- Calcular automáticamente el balance mensual.
- Visualizar estadísticas con filtros (monto, categoría, fecha).
- Configurar y seguir metas de ahorro.

Está pensada especialmente para **estudiantes, trabajadores y pequeños emprendedores** que buscan mejorar su educación financiera.

---

## 🎯 Propósito
- Generar **conciencia financiera**.
- Fomentar cambios de hábitos de consumo.
- Reducir la **ansiedad económica**.
- Empoderar al usuario sobre su dinero.

---

## ⚙️ Tecnologías
- **Backend:** Java 17 + Spring Boot 3, Spring Web, Spring Data JPA, Spring Security (JWT), Lombok.  
- **Base de datos:** MySQL.  
- **Documentación:** OpenAPI / Swagger.  
- **Repositorio y control de versiones:** GitHub.  
- **(Opcional a futuro):** Docker para despliegue en cloud.

---

## 🧩 Microservicios (Spring Boot, sin gateway)
- **auth-service:** crear cuenta, iniciar sesión y entregar el token (JWT).  
  BD: users, roles.  

- **transaction-service:** crear/editar/borrar ingresos y egresos, organizarlos por categorías.  
  BD: transactions, categories.  

- **goal-service:** manejar metas de ahorro y su progreso.  
  BD: goals, goal_progress.  

- **analytics-service:** calcular balance mensual y gasto por categoría leyendo transacciones.

Cada servicio tiene su propia base de datos en MySQL para mantener la independencia.

---
