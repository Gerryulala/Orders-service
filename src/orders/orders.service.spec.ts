import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

const mockOrder = {
  id: 1,
  user_id: 1,
  productos: [{ nombre: 'Camiseta', cantidad: 2, precio: 15.5 }],
  total: 31,
  fecha: new Date(),
  estado: 'PENDIENTE',
};

const mockOrderRepo = {
  create: jest.fn().mockReturnValue(mockOrder),
  save: jest.fn().mockResolvedValue(mockOrder),
  find: jest.fn().mockResolvedValue([mockOrder]),
  findOneBy: jest.fn().mockResolvedValue(mockOrder),
};

const mockCache = {
  get: jest.fn().mockResolvedValue(null), // puedes cambiar esto por mockOrder si quieres probar cache
  set: jest.fn(),
  del: jest.fn(),
};

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: getRepositoryToken(Order), useValue: mockOrderRepo },
        { provide: CACHE_MANAGER, useValue: mockCache },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debería obtener órdenes desde la base si no hay cache', async () => {
    mockCache.get.mockResolvedValue(null);
    const result = await service.findAll();
    expect(result).toEqual([mockOrder]);
    expect(mockOrderRepo.find).toHaveBeenCalled();
  });

  it('debería obtener órdenes desde cache si existe', async () => {
    mockCache.get.mockResolvedValue([mockOrder]);
    const result = await service.findAll();
    expect(result).toEqual([mockOrder]);
    expect(mockOrderRepo.find).not.toHaveBeenCalled(); // porque usó el cache
  });

  it('debería crear una orden y limpiar cache', async () => {
    const result = await service.create(mockOrder as any);
    expect(mockOrderRepo.save).toHaveBeenCalledWith(mockOrder);
    expect(mockCache.del).toHaveBeenCalledWith('orders');
    expect(result).toEqual(mockOrder);
  });
});
