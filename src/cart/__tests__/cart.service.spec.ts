import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '../cart.service';
import { CartProductService } from '@/cart-product/cart-product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartEntity } from '../entities/cart.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { returnDeleteMock } from '@/__mocks__/return-delete.mocl';
import { cartMock } from '../__mocks__/cart.mock';
import { userEntityMock } from '@/user/__mocks__/user.mock';

describe('CartService', () => {
  let service: CartService;
  let cartRepository: Repository<CartEntity>;
  let cartProductService: CartProductService;


  beforeEach(async () => {
    // jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(CartEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(cartMock),
            save: jest.fn().mockResolvedValue(cartMock),
          },
        },
        {
          provide: CartProductService,
          useValue: {
            insertProductInCart: jest.fn(),
            deleteProductCart: jest.fn().mockResolvedValue(returnDeleteMock),
            updateProductInCart: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartRepository = module.get(getRepositoryToken(CartEntity));
    cartProductService = module.get(CartProductService);
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cartRepository).toBeDefined();
    expect(cartProductService).toBeDefined();
  })

  it('should return delete result if delete cart', async () => {
    const spy = jest.spyOn(cartRepository, 'save');

    const resultDelete = await service.clearCart(userEntityMock.id);

    expect(resultDelete).toEqual(returnDeleteMock);
    expect(spy.mock.calls[0][0]).toEqual({
      ...cartMock,
      active: false,
    })
  })


})