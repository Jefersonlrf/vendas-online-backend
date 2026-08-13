import { CartProductEntity } from '@/cart-product/entities/cart-product.entity';
import { CartEntity } from '@/cart/entities/cart.entity';
import { CreateOrderDTO } from '@/order/dtos/create-order.dto';
import { PaymentType } from '@/payment-status/enums/payment-type.enum';
import { ProductEntify } from '@/product/entities/product.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentCreditCardEntity } from './entities/payment-credit-card.entity';
import { PaymentPixEntity } from './entities/payment-pix.entity';
import { PaymentEntity } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
  ) {}

  async createPayment(
    createOrderDTO: CreateOrderDTO,
    products: ProductEntify[],
    cart: CartEntity,
  ): Promise<PaymentEntity> {
    const finalPrice =
      cart.cartProduct
        ?.map((cartProduct: CartProductEntity) => {
          const product = products.find(
            (product) => product.id === cartProduct.productId,
          );
          if (product) {
            return cartProduct.amount * product.price;
          }

          return 0;
        })
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0) ??
      0;

    if (createOrderDTO.amountPayments) {
      const paymentCredicard = new PaymentCreditCardEntity(
        PaymentType.Done,
        finalPrice,
        0,
        finalPrice,
        createOrderDTO,
      );
      return this.paymentRepository.save(paymentCredicard);
    } else if (createOrderDTO.codePix && createOrderDTO.datePayment) {
      const paymentPix = new PaymentPixEntity(
        PaymentType.Done,
        finalPrice,
        0,
        finalPrice,
        createOrderDTO,
      );
      return this.paymentRepository.save(paymentPix);
    }
    throw new BadRequestException(
      'Amount Payment ot code pix ou date payment not found',
    );
  }
}
