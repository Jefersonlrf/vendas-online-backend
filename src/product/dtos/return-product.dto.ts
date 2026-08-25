import { ReturnCategory } from '@/category/dtos/return-category.dto';
import { ProductEntify } from '../entities/product.entity';

export class ReturnProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: ReturnCategory;

  constructor(productEntity: ProductEntify) {
    this.id = productEntity.id;
    this.name = productEntity.name;
    this.price = productEntity.price;
    this.image = productEntity.image;
    this.category = productEntity.category
      ? new ReturnCategory(productEntity.category)
      : undefined;
  }
}
