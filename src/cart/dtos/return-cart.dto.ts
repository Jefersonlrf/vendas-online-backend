import { CartEntity } from '../entities/cart.entity';
import { ReturnCartProductDTO } from '@/cart-product/dtos/return-cart-product.dto';

export class ReturnCartDTO {
  id!: number;
  cartProduct?: ReturnCartProductDTO[];

  constructor(cart: CartEntity | null) {
    if (!cart) return;
    this.id = cart.id;
    this.cartProduct = cart.cartProduct
      ? cart.cartProduct.map(
          (cartProduct) => new ReturnCartProductDTO(cartProduct),
        )
      : undefined;
  }
}
