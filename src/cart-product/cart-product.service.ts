import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartProductEntity } from './entities/cart-product.entity';
import { Repository } from 'typeorm';
import { InsertCartDTO } from '@/cart/dtos/insert-cart.dto';
import { CartEntity } from '@/cart/entities/cart.entity';

@Injectable()
export class CartProductService {

    constructor(
        @InjectRepository(CartProductEntity)
        private readonly cartPorductRepository: Repository<CartProductEntity>) { }


    async verifyProductInCart(productId: number, cartId: number): Promise<CartProductEntity> {
        const cartProduct = await this.cartPorductRepository.findOne({
            where: {
                productId,
                cartId,
            }
        });

        if (!cartProduct) {
            throw new NotFoundException('Product not found in cart')
        }
        return cartProduct;
    }

    async createProductInCart(insertCartDTO: InsertCartDTO, cartId: number): Promise<CartProductEntity> {
        return this.cartPorductRepository.save({
            amount: insertCartDTO.amount,
            productId: insertCartDTO.productId,
            cartId,
        });

    }

    async insertProductInCart(insertCartDTO: InsertCartDTO, cart: CartEntity): Promise<CartProductEntity> {
        const cartProduct = await this.verifyProductInCart(insertCartDTO.productId, cart.id).
            catch(() => undefined);

        if (!cartProduct) {
            return this.createProductInCart(insertCartDTO, cart.id);
        }
        return this.cartPorductRepository.save({
            ...cartProduct,
            amount: cartProduct.amount + insertCartDTO.amount,
        });
    }
}
