import { Injectable } from '@nestjs/common';
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
  ) {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'orders_queue',
        queueOptions: { durable: false },
      },
    });
  }

  async create(dto: CreateOrderDto) {
    const order = this.repo.create(dto);
    const saved = await this.repo.save(order);

    this.client.emit('order_created', saved); // 🐇 Emitir a RabbitMQ

    return saved;
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }
}
