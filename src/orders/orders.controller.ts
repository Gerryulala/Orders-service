import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Req,
  Inject,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post()
  async create(@Body() dto: CreateOrderDto, @Req() req) {
    const userId = req.user.userId;
    dto.user_id = userId;

    const orden = await this.ordersService.create(dto);

    return {
      message: 'Orden creada con éxito',
      orden,
    };
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  // 🔧 ENDPOINT DE PRUEBA MANUAL DE REDIS
  @Get('/test/set')
  async testSetCache() {
    await this.cacheManager.set('foo', { hello: 'world' }, 300); // 5 min
    return { message: '✔️ Valor seteado en Redis' };
  }

  @Get('/test/get')
  async testGetCache() {
    const value = await this.cacheManager.get('foo');
    return { value };
  }
}
