import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderProductEntity } from '../entities/order-product.entity';
import { OrderProductService } from '../order-product.service';

describe('OrderProductService', () => {
  let service: OrderProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderProductService,
        {
          provide: getRepositoryToken(OrderProductEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<OrderProductService>(OrderProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
