import { CreateOrderDTO } from '@/order/dtos/create-order.dto';
import { PaymentType } from '@/payment-status/enums/payment-type.enum';
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

  async createPayment(createOrderDTO: CreateOrderDTO): Promise<PaymentEntity> {
    if (createOrderDTO.amountPayments) {
      const paymentCredicard = new PaymentCreditCardEntity(
        PaymentType.Done,
        0,
        0,
        0,
        createOrderDTO,
      );
      return this.paymentRepository.save(paymentCredicard);
    } else if (createOrderDTO.codePix && createOrderDTO.datePayment) {
      const paymentPix = new PaymentPixEntity(
        PaymentType.Done,
        0,
        0,
        0,
        createOrderDTO,
      );
      return this.paymentRepository.save(paymentPix);
    }
    throw new BadRequestException(
      'Amount Payment ot code pix ou date payment not found',
    );
  }
}
