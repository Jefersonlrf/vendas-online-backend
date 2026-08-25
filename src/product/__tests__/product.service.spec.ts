import { returnDeleteMock } from '@/__mocks__/return-delete.mocl';
import { categoryMock } from '@/category/__mocks__/categoty.mock';
import { CategoryService } from '@/category/category.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { createProductMock } from '../__mocks__/create-product.mock';
import { productMock } from '../__mocks__/product.mock';
import { ProductEntify } from '../entities/product.entity';
import { ProductService } from '../product.service';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<ProductEntify>;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: CategoryService,
          useValue: {
            findCategoryById: jest.fn().mockResolvedValue(categoryMock),
          },
        },
        {
          provide: getRepositoryToken(ProductEntify),
          useValue: {
            find: jest.fn().mockResolvedValue([productMock]),
            findOne: jest.fn().mockResolvedValue(productMock),
            save: jest.fn().mockResolvedValue(productMock),
            delete: jest.fn().mockResolvedValue(returnDeleteMock),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);

    categoryService = module.get<CategoryService>(CategoryService);

    productRepository = module.get<Repository<ProductEntify>>(
      getRepositoryToken(ProductEntify),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryService).toBeDefined();
    expect(productRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = await service.findAll();

      expect(products).toEqual([productMock]);

      expect(productRepository.find).toHaveBeenCalledWith({});
    });

    it('should return relations in find all products', async () => {
      const spy = jest.spyOn(productRepository, 'find');
      const products = await service.findAll([], true);

      expect(products).toEqual([productMock]);
      expect(spy.mock.calls[0][0]).toEqual({
        relations: {
          category: true,
        },
      });
    });

    it('should return relatiosn and array in find all products', async () => {
      const spy = jest.spyOn(productRepository, 'find');
      const products = await service.findAll([1], true);

      expect(products).toEqual([productMock]);
      expect(spy.mock.calls[0][0]).toEqual({
        where: {
          id: In([1]),
        },
        relations: {
          category: true,
        },
      });
    });

    it('should return products by ids', async () => {
      const productIds = [productMock.id];

      const products = await service.findAll(productIds);

      expect(products).toEqual([productMock]);

      expect(productRepository.find).toHaveBeenCalled();
    });

    it('should throw when products are empty', async () => {
      jest.spyOn(productRepository, 'find').mockResolvedValue([]);

      await expect(service.findAll()).rejects.toThrow();
    });

    it('should throw when repository find fails', async () => {
      jest.spyOn(productRepository, 'find').mockRejectedValue(new Error());

      await expect(service.findAll()).rejects.toThrow(Error);
    });
  });

  describe('createProduct', () => {
    it('should return product after insert in DB', async () => {
      const product = await service.createProduct(createProductMock);

      expect(product).toEqual(productMock);

      expect(categoryService.findCategoryById).toHaveBeenCalledWith(
        createProductMock.categoryId,
      );

      expect(productRepository.save).toHaveBeenCalledWith({
        ...createProductMock,
      });
    });

    it('should throw when category is not found', async () => {
      jest
        .spyOn(categoryService, 'findCategoryById')
        .mockRejectedValue(new Error());

      await expect(service.createProduct(createProductMock)).rejects.toThrow(
        Error,
      );

      expect(productRepository.save).not.toHaveBeenCalled();
    });

    it('should throw when product save fails', async () => {
      jest.spyOn(productRepository, 'save').mockRejectedValue(new Error());

      await expect(service.createProduct(createProductMock)).rejects.toThrow(
        Error,
      );
    });
  });

  describe('findProductById', () => {
    it('should return product by id', async () => {
      const product = await service.findProductById(productMock.id);

      expect(product).toEqual(productMock);

      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: productMock.id,
        },
      });
    });

    it('should throw when product is not found', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findProductById(productMock.id)).rejects.toThrow();
    });

    it('should throw when repository findOne fails', async () => {
      jest.spyOn(productRepository, 'findOne').mockRejectedValue(new Error());

      await expect(service.findProductById(productMock.id)).rejects.toThrow(
        Error,
      );
    });
  });

  describe('deleteProduct', () => {
    it('should return deleted result', async () => {
      const deleted = await service.deleteProduct(productMock.id);

      expect(deleted).toEqual(returnDeleteMock);

      expect(productRepository.delete).toHaveBeenCalledWith({
        id: productMock.id,
      });
    });

    it('should not delete product when product does not exist', async () => {
      jest.spyOn(service, 'findProductById').mockRejectedValue(new Error());

      await expect(service.deleteProduct(productMock.id)).rejects.toThrow(
        Error,
      );

      expect(productRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw when delete fails', async () => {
      jest.spyOn(productRepository, 'delete').mockRejectedValue(new Error());

      await expect(service.deleteProduct(productMock.id)).rejects.toThrow(
        Error,
      );
    });
  });

  describe('updateProduct', () => {
    it('should return product after update', async () => {
      const product = await service.updateProduct(
        createProductMock,
        productMock.id,
      );

      expect(product).toEqual(productMock);

      expect(productRepository.save).toHaveBeenCalledWith({
        ...productMock,
        ...createProductMock,
      });
    });

    it('should throw when product does not exist', async () => {
      jest.spyOn(service, 'findProductById').mockRejectedValue(new Error());

      await expect(
        service.updateProduct(createProductMock, productMock.id),
      ).rejects.toThrow(Error);

      expect(productRepository.save).not.toHaveBeenCalled();
    });

    it('should throw when update fails', async () => {
      jest.spyOn(productRepository, 'save').mockRejectedValue(new Error());

      await expect(
        service.updateProduct(createProductMock, productMock.id),
      ).rejects.toThrow(Error);
    });
  });
});
