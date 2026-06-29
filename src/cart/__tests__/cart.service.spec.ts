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
import { insertCartMock } from '../__mocks__/insert-cart.mock';
import { productMock } from '@/product/__mocks__/product.mock';
import { updateCartMock } from '../__mocks__/update-cart.mock';

describe('CartService', () => {
  let service: CartService;
  let cartRepository: Repository<CartEntity>;
  let cartProductService: CartProductService;


  beforeEach(async () => {
    jest.clearAllMocks();

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

  it('should return error in findOne undefined', async () => {
    jest.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined!);

    expect(service.clearCart(userEntityMock.id)).rejects.toThrow(
      NotFoundException,
    );
  })

  it('should return cart in success (not send relations)', async () => {
    const spy = jest.spyOn(cartRepository, 'findOne');
    const cart = await service.findCartByUserId(userEntityMock.id);

    expect(cart).toEqual(cartMock);
    expect(spy.mock.calls[0][0].relations).toEqual(undefined!);
  })

  it('should return cart in success (send relations)', async () => {
    const spy = jest.spyOn(cartRepository, 'findOne');
    const cart = await service.findCartByUserId(userEntityMock.id, true);

    expect(cart).toEqual(cartMock);
    expect(spy.mock.calls[0][0].relations).toEqual({
      cartProduct: {
        product: true,
      }
    })
  })

  it('should return notFoundException in not found cart', async () => {
    jest.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined!);

    expect(service.findCartByUserId(userEntityMock.id)).rejects.toThrow(
      NotFoundException,
    )
  })

  it('should return send info in save (createCart)', async () => {
    const spy = jest.spyOn(cartRepository, 'save');

    const cart = await service.createCart(userEntityMock.id);

    expect(cart).toEqual(cartMock);
    expect(spy.mock.calls[0][0]).toEqual({
      active: true,
      userId: userEntityMock.id,
    })
  })

  it('should return cart in cart not found (insertProductInCart)', async () => {
    jest.spyOn(cartRepository, 'findOne')
      .mockResolvedValueOnce(undefined!)

    const saveSpy = jest.spyOn(cartRepository, 'save');

    const insertSpy = jest.spyOn(
      cartProductService,
      'insertProductInCart',
    );

    const result = await service.insertProductInCart(
      insertCartMock,
      userEntityMock.id,
    );

    expect(result).toEqual(cartMock);

    expect(saveSpy).toHaveBeenCalledWith({
      active: true,
      userId: userEntityMock.id,
    });

    expect(insertSpy).toHaveBeenCalledWith(
      insertCartMock,
      cartMock,
    );

    expect(cartRepository.findOne).toHaveBeenCalledTimes(2);
  });

  it('should return cart in cart found (insertProductInCart)', async () => {
    jest.spyOn(cartRepository, 'findOne')
      .mockResolvedValueOnce(cartMock)

    const spyInsert = jest.spyOn(
      cartProductService,
      'insertProductInCart',
    );

    const result = await service.insertProductInCart(
      insertCartMock,
      userEntityMock.id,
    );

    expect(result).toEqual(cartMock);

    expect(spyInsert).toHaveBeenCalledWith(
      insertCartMock,
      cartMock,
    );

    expect(cartRepository.findOne).toHaveBeenCalledTimes(2);
  });

  it('should return DeleteResult in deleteProductCart', async () => {
    const spy = jest.spyOn(cartProductService, 'deleteProductCart');
    const DeleteResult = await service.deleteProductCart(
      productMock.id,
      userEntityMock.id
    )

    expect(DeleteResult).toEqual(returnDeleteMock);
    expect(spy.mock.calls.length).toEqual(1);
  })

  it('should return NotFoundException in cart not exist', async () => {
    jest.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined!);
    const spy = jest.spyOn(cartProductService, 'deleteProductCart');

    expect(
      service.deleteProductCart(productMock.id, userEntityMock.id),
    ).rejects.toThrow(NotFoundException);
    expect(spy.mock.calls.length).toEqual(0);
  })

  it('should return cart in updateProductInCart', async () => {
    const spyCartProductService = jest.spyOn(
      cartProductService,
      'updateProductInCart'
    )

    const spySave = jest.spyOn(cartRepository, 'save');
    const cart = await service.updateProductInCart(
      updateCartMock,
      userEntityMock.id
    )

    expect(cart).toEqual(cartMock);
    expect(spyCartProductService.mock.calls.length).toEqual(1);
    expect(spySave.mock.calls.length).toEqual(0);
  })

  it('should return cart in createCart', async () => {
    jest.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined!);

    const spySave = jest.spyOn(cartRepository, 'save');
    const cart = await service.updateProductInCart(
      updateCartMock,
      userEntityMock.id
    )

    expect(cart).toEqual(cartMock);
    expect(spySave.mock.calls.length).toEqual(1);
  });



})