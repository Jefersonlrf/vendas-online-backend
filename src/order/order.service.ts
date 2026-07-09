import { CartService } from '@/cart/cart.service';
import { OrderProductService } from '@/order-product/order-product.service';
import { PaymentEntity } from '@/payment/entities/payment.entity';
import { PaymentService } from '@/payment/payment.service';
import { Injectable, Logger } from '@nestjs/common';
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
  ) {}

  async createOrder(
    createOrderDTO: CreateOrderDTO,
    cartId: number,
    userId: number,
  ) {
    const payment: PaymentEntity =
      await this.paymentService.createPayment(createOrderDTO);

    const order = await this.orderRepository.save({
      addressId: createOrderDTO.addressId,
      date: new Date(),
      paymentId: payment.id,
      userId,
    });

    const cart = await this.cartService.findCartByUserId(userId, true);

    cart.cartProduct?.forEach((cartProduct) => {
      this.orderProductService
        .createOrderProduct(
          cartProduct.productId,
          order.id,
          0,
          cartProduct.amount,
        )
        .catch((error) => Logger.error(error));
    });

    return null;
  }
}
