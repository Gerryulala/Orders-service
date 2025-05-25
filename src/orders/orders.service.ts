import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class OrdersService {
  private client: ClientProxy;

  constructor(
    @InjectRepository(Order)
    private repo: Repository<Order>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [
          process.env.APP_ENV === 'docker'
            ? `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@rabbitmq:${process.env.RABBITMQ_PORT}`
            : `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@localhost:${process.env.RABBITMQ_PORT}`,
        ],
        queue: process.env.RABBITMQ_QUEUE || 'orders_queue',
        queueOptions: { durable: false },
      },
    });
  }

  async create(dto: CreateOrderDto) {
    const order = this.repo.create(dto);
    const saved = await this.repo.save(order);

    this.client.emit('order_created', saved);

    // ❌ Invalida cache de Redis tras crear
    await this.cacheManager.del('orders');

    return saved;
  }

  async findAll() {
    const cacheKey = 'orders';
    const cached = await this.cacheManager.get(cacheKey);

    if (cached) {
      console.log('💾 Usando cache desde Redis!');
      return cached;
    }

    const orders = await this.repo.find();
    const ttl = parseInt(process.env.REDIS_TTL || '60');

    // ✅ Set cache correctamente
    await this.cacheManager.set(cacheKey, orders, ttl);

    const test = await this.cacheManager.get(cacheKey);
    console.log('🚀 Cache creado en Redis:', test ? '✔️ OK' : '❌ Falló');

    return orders;
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }
}
