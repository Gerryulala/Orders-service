// src/orders/orders.events.controller.ts
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class OrdersEventsController {
  @EventPattern('order_created')
  handleOrderCreated(@Payload() data: any) {
    console.log('🔔 Notificación simulada recibida desde RabbitMQ');
    console.log(`📦 Procesando orden #${data.id} del usuario #${data.user_id}`);
    console.log(`🧾 Productos: ${data.productos.map(p => `${p.nombre} x${p.cantidad}`).join(', ')}`);
    console.log(`💰 Total: $${data.total}`);
    console.log(`💸 Simulación: Factura generada y enviada al cliente.`);

    // Aquí podrías enviar email real, guardar en MongoDB, etc.
  }
}
