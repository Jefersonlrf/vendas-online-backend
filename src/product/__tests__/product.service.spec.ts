import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { Repository } from 'typeorm';
import { ProductEntify } from '../entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { productMock } from '../__mocks__/product.mock';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<ProductEntify>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService, {
        provide: getRepositoryToken(ProductEntify),
        useValue: {
          find: jest.fn().mockResolvedValue([productMock]),
          save: jest.fn().mockResolvedValue(productMock),
        }
      }],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<ProductEntify>>(
      getRepositoryToken(ProductEntify),
    )
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(productRepository).toBeDefined();
  });

  it('should return all products', async () => {
    const products = await service.findAll();
    expect(products).toEqual([productMock]);
  });

  it('should return error if products empty', async () => {
    jest.spyOn(productRepository, 'find').mockResolvedValue([]);
    expect(service.findAll()).rejects.toThrow();
  });

  it('should return error in exception', async () => {
    jest.spyOn(productRepository, 'find').mockRejectedValue(new Error());
    expect(service.findAll()).rejects.toThrow();
  });
});
