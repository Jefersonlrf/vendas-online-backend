import { ProductEntify } from '@/product/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('category')
export class CategoryEntify {
  @PrimaryGeneratedColumn('rowid')
  id!: number;

  @Column({ name: 'name', nullable: false })
  name!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => ProductEntify, (product: ProductEntify) => product.category)
  products?: ProductEntify;
}
