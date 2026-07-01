import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from '../cart.controller';
import { CartService } from '../cart.service';
import { cartMock } from '../__mocks__/cart.mock';
import { insertCartMock } from '../__mocks__/insert-cart.mock';
import { userEntityMock } from '@/user/__mocks__/user.mock';
import { returnDeleteMock } from '@/__mocks__/return-delete.mocl';
import { updateCartMock } from '../__mocks__/update-cart.mock';
import { productMock } from '@/product/__mocks__/product.mock';

describe('CartController', () => {
  let cartController: CartController;
  let cartService: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CartService,
          useValue: {
            insertProductInCart: jest.fn().mockResolvedValue(cartMock),
            findCartByUserId: jest.fn().mockResolvedValue(cartMock),
            clearCart: jest.fn().mockResolvedValue(returnDeleteMock),
            deleteProductCart: jest.fn().mockResolvedValue(returnDeleteMock),
            updateProductInCart: jest.fn().mockResolvedValue(cartMock),
          },
        },
      ],
      controllers: [CartController],
    }).compile();

    cartController = module.get<CartController>(CartController);
    cartService = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(cartController).toBeDefined();
    expect(cartService).toBeDefined();
  });

  it('should cart Entity in insertProductInCart', async () => {
    const cart = await cartController.createCart(
      insertCartMock,
      userEntityMock.id,
    );

    expect(cart).toEqual({
      id: cartMock.id,
    });
  });

  it('should cart Entity in insertProductInCart', async () => {
    const cart = await cartController.findCartByUserId(userEntityMock.id);

    expect(cart).toEqual({
      id: cartMock.id,
    });
  });

  it('should return DeleteResult in clearCart', async () => {
    const cart = await cartController.clearCart(userEntityMock.id);

    expect(cart).toEqual(returnDeleteMock);
  });

  it('should delete a product from cart', async () => {
    const cart = await cartController.deleteProductCart(
      productMock.id,
      userEntityMock.id,
    );

    expect(cart).toEqual(returnDeleteMock);
  });

  it('should cart Entity in updateProductInCart', async () => {
    const cart = await cartController.updateProductInCart(
      updateCartMock,
      userEntityMock.id,
    );

    expect(cart).toEqual({
      id: cartMock.id,
    });
  });
});
