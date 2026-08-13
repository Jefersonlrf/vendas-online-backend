import { CartService } from '@/cart/cart.service';
import { CartEntity } from '@/cart/entities/cart.entity';
import { OrderProductEntity } from '@/order-product/entities/order-product.entity';
import { OrderProductService } from '@/order-product/order-product.service';
import { PaymentEntity } from '@/payment/entities/payment.entity';
import { PaymentService } from '@/payment/payment.service';
import { ProductEntify } from '@/product/entities/product.entity';
import { ProductService } from '@/product/product.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { OrderEntity } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly paymentService: PaymentService,
    private readonly cartService: CartService,
    private readonly orderProductService: OrderProductService,
    private readonly productService: ProductService,
  ) {}

  async saveOrder(
    createOrderDTO: CreateOrderDTO,
    userId: number,
    payment: PaymentEntity,
  ): Promise<OrderEntity> {
    return await this.orderRepository.save({
      addressId: createOrderDTO.addressId,
      date: new Date(),
      paymentId: payment.id,
      userId,
    });
  }

  async createOrderProductUsingCart(
    cart: CartEntity,
    orderId: number,
    products: ProductEntify[],
  ): Promise<OrderProductEntity[]> {
    return await Promise.all(
      (cart.cartProduct ?? []).map((cartProduct) =>
        this.orderProductService.createOrderProduct(
          cartProduct.productId,
          orderId,
          products.find((product) => product.id === cartProduct.productId)
            ?.price || 0,
          cartProduct.amount,
        ),
      ),
    );
  }

  async createOrder(
    createOrderDTO: CreateOrderDTO,
    userId: number,
  ): Promise<OrderEntity> {
    const cart = await this.cartService.findCartByUserId(userId, true);
    const products = await this.productService.findAll(
      cart.cartProduct?.map((cartProduct) => cartProduct.productId),
    );
    const payment: PaymentEntity = await this.paymentService.createPayment(
      createOrderDTO,
      products,
      cart,
    );

    const order = await this.saveOrder(createOrderDTO, userId, payment);

    await this.createOrderProductUsingCart(cart, order.id, products);

    await this.cartService.clearCart(userId);

    return order;
  }
}
