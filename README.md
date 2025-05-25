# 📦 Sistema de Gestión de Órdenes con Notificaciones – Backend (NestJS)

Este proyecto es una solución backend en **NestJS** para gestionar órdenes, asociarlas a usuarios, almacenarlas en **PostgreSQL** y enviar notificaciones simuladas mediante **RabbitMQ**. Además, expone métricas básicas en formato Prometheus.

---

## ✅ Requerimientos cumplidos

1. **API REST** para:
   - Crear, listar y consultar órdenes.
   - Asociar órdenes a usuarios (`user_id`).
   - Cada orden incluye: productos, cantidad, total, fecha, estado.

2. **Persistencia en PostgreSQL** usando **TypeORM**.

3. **Notificaciones simuladas**:
   - Se emite un evento `order_created` a RabbitMQ al crear una orden.
   - Un microservicio escucha este evento y **simula una notificación de envío o facturación**.

4. **Métricas básicas**:
   - Expuestas en [`/metrics`](http://localhost:3000/metrics) vía `@willsoto/nestjs-prometheus`.

---

## 🚀 Cómo ejecutar el proyecto

### 1. Instala las dependencias

```bash
npm install
```

### 2. Levanta PostgreSQL y RabbitMQ con Docker

```bash
docker-compose up -d
```

> 🐇 RabbitMQ UI: [http://localhost:15672](http://localhost:15672)  
> Usuario: `guest` | Contraseña: `guest`

### 3. Ejecuta la API REST principal

```bash
npm run start:dev
```

#### Endpoints disponibles:

| Método | Ruta             | Descripción         |
|--------|------------------|---------------------|
| POST   | `/orders`        | Crear nueva orden   |
| GET    | `/orders`        | Listar todas        |
| GET    | `/orders/:id`    | Consultar una orden |

### 4. Ejecuta el microservicio que simula la notificación

```bash
npx ts-node src/main.listener.ts
```

#### Este microservicio escucha el evento `order_created` y muestra en consola:

```
🔔 Notificación simulada recibida desde RabbitMQ
📦 Procesando orden #12 del usuario #1
🧾 Productos: Camiseta x2, Gorra x1
💰 Total: $39
💸 Simulación: Factura generada y enviada al cliente.
```

### 5. Ver métricas

Accede a:

```bash
http://localhost:3000/metrics
```

---

## 📦 Ejemplo de cuerpo para crear una orden

```json
{
  "user_id": 1,
  "productos": [
    { "nombre": "Camiseta", "cantidad": 2, "precio": 15.5 },
    { "nombre": "Gorra", "cantidad": 1, "precio": 8.0 }
  ],
  "total": 39.0,
  "estado": "PENDIENTE"
}
```

---

## 🛠️ Tecnologías utilizadas

- **NestJS** – Framework backend
- **TypeORM** – ORM para PostgreSQL
- **PostgreSQL** – Base de datos relacional
- **RabbitMQ** – Broker de eventos asíncronos (`@nestjs/microservices`)
- **Prometheus** – Métricas (`@willsoto/nestjs-prometheus`)

---

✅ **Estado del proyecto:** Completado y listo para entrega.
