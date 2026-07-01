import { CartEntity } from '@/cart/entities/cart.entity';
import { ProductEntify } from '@/product/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('cart_product')
export class CartProductEntity {
  @PrimaryGeneratedColumn('rowid')
  id!: number;

  @Column({ name: 'cart_id', nullable: false })
  cartId!: number;

  @Column({ name: 'product_id', nullable: false })
  productId!: number;

  @Column({ name: 'amount', nullable: false })
  amount!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(
    () => ProductEntify,
    (productEntity: ProductEntify) => productEntity.cartProduct,
  )
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product?: ProductEntify;

  @ManyToOne(() => CartEntity, (cartEntity) => cartEntity.cartProduct)
  @JoinColumn({ name: 'cart_id', referencedColumnName: 'id' })
  cart?: CartEntity;
}
