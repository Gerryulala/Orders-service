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

5. **Bonus adicionales**:
   - ✅ Autenticación con JWT.
   - ✅ Caching en Redis.
   - ✅ Dockerización completa.
   - ✅ Tests unitarios básicos.

---

## 🚀 Cómo ejecutar el proyecto

### 1. Clona el repositorio

```bash
git clone git@github.com:Gerryulala/Orders-service.git
cd orders-service

```

### 2. Instala las dependencias

```bash
npm install
```

### Crea un archivo .env (usa esto como base)

# APP MODE

APP_ENV=local

# JWT

JWT_SECRET=supersecret123
JWT_EXP=3600s

# PostgreSQL

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=gerry123
POSTGRES_DB=DataBase

# Redis

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_TTL=600

# RabbitMQ

RABBITMQ_USER=guest
RABBITMQ_PASS=guest
RABBITMQ_PORT=5672
RABBITMQ_QUEUE=orders_queue

### 4. Levanta PostgreSQL y RabbitMQ con Docker

```bash
docker-compose up -d
```

> 🐇 RabbitMQ UI: [http://localhost:15672](http://localhost:15672)  
> Usuario: `guest` | Contraseña: `guest`

### 4. Ejecuta la API REST principal

```bash
npm run start:dev
```

Asegúrate de tener .env con APP_ENV=local
Esto iniciará tanto:

El servidor REST (/orders, /auth)

Como el microservicio de eventos (order_created)

#### Endpoints disponibles:

| Método | Ruta             | Descripción              |
| ------ | ---------------- | ------------------------ |
| POST   | `/orders`        | Crear nueva orden        |
| GET    | `/orders`        | Listar todas las órdenes |
| GET    | `/orders/:id`    | Obtener orden por ID     |
| POST   | `/auth/register` | Registrar usuario        |
| POST   | `/auth/login`    | Login y obtener JWT      |

### . Ejecuta el microservicio que simula la notificación

```bash cualquiera de los dos comandos
npx ts-node src/main.ts
npx npm run start:dev
```

#### Este microservicio escucha el evento `order_created` y muestra en consola:

```
🔔 Notificación simulada recibida desde RabbitMQ
📦 Procesando orden #12 del usuario #1
🧾 Productos: Camiseta x2, Gorra x1
💰 Total: $39
💸 Simulación: Factura generada y enviada al cliente.
```

### 5. Ver métricas y Prometheus

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

## ⚙️ Tecnologías utilizadas

- **NestJS** – Framework modular para Node.js
- **TypeORM** – ORM para bases de datos SQL
- **PostgreSQL** – Base de datos relacional
- **RabbitMQ** – Sistema de colas de mensajes
- **Redis** – Caché en memoria
- **Prometheus** – Sistema de monitoreo
- **Docker** – Contenedores y orquestación

---

## 🐳 Dockerización

El archivo `docker-compose.yml` levanta:

- `postgres` – Base de datos
- `redis` – Cache
- `rabbitmq` – Broker de eventos (con UI web)
- `nestjs` – API principal (si se configura)
- `listener` – Microservicio de RabbitMQ (si se separa)

---

## 🐳 Ejecutar el proyecto con Docker

Para levantar toda la infraestructura (PostgreSQL, Redis, RabbitMQ y NestJS API) usando Docker, sigue estos pasos:

### 1. Asegúrate de que tu archivo `.env` esté configurado para Docker:

```env
APP_ENV=docker

POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=gerry123
POSTGRES_DB=DataBase

REDIS_HOST=redis
REDIS_PORT=6379
REDIS_TTL=600

RABBITMQ_USER=guest
RABBITMQ_PASS=guest
RABBITMQ_PORT=5672
RABBITMQ_QUEUE=orders_queue
```

> 👆 Este `.env` usa los **nombres de servicio definidos en `docker-compose.yml`** como hostnames.

---

### 2. Ejecuta el proyecto completo con:

```bash
docker compose up --build
```

Este comando hará lo siguiente:

- Construirá la imagen de tu API NestJS (`orders-api`)
- Levantará:
  - `postgres` (base de datos)
  - `redis` (sistema de caché)
  - `rabbitmq` (broker de eventos)
  - `orders-api` (servidor backend NestJS)

---

### 3. Verifica servicios activos

- 🔗 API NestJS: [http://localhost:3000](http://localhost:3000)
- 📈 Métricas Prometheus: [http://localhost:3000/metrics](http://localhost:3000/metrics)
- 🐇 RabbitMQ UI: [http://localhost:15672](http://localhost:15672)
  - Usuario: `guest`
  - Contraseña: `guest`

---

### 4. Crear una orden con Postman o curl

```http
POST http://localhost:3000/orders
Content-Type: application/json

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

✔️ Deberías ver la notificación simulada en consola desde el microservicio.

---

## 🧩 ¿Problemas al alternar entre Docker y entorno local?

Si estás usando Docker y luego decides volver a entorno local, algunos servicios como RabbitMQ pueden quedar inactivos. Para asegurarte de tener Redis, RabbitMQ y PostgreSQL activos:
docker compose up -d postgres redis rabbitmq
