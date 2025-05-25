// Solución al error de CACHE_MANAGER en tus tests

// Este ejemplo soluciona el error del controller:
// "Nest can't resolve dependencies of the OrdersController (OrdersService, ?)."
// → Esto pasa porque estás usando CACHE_MANAGER pero no lo registraste en el test

// 📁 src/orders/orders.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

const mockOrder = {
  id: 1,
  user_id: 1,
  productos: [],
  total: 39,
  fecha: new Date(),
  estado: 'PENDIENTE',
};

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  const mockOrdersService = {
    create: jest.fn().mockResolvedValue(mockOrder),
    findAll: jest.fn().mockResolvedValue([mockOrder]),
    findOne: jest.fn().mockResolvedValue(mockOrder),
  };

  const mockCacheManager = {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        { provide: OrdersService, useValue: mockOrdersService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('debería crear una orden', async () => {
    const dto = { productos: [], total: 39, fecha: new Date(), estado: 'PENDIENTE', user_id: 1 };
    const req = { user: { userId: 1 } };

    const result = await controller.create(dto as any, req as any);
    expect(result).toEqual(mockOrder);
  });

  it('debería obtener todas las órdenes', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockOrder]);
  });

  it('debería obtener una orden por ID', async () => {
    const result = await controller.findOne('1');
    expect(result).toEqual(mockOrder);
  });
});
