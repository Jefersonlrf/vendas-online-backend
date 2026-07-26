import { CategoryService } from '@/category/category.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository } from 'typeorm';
import { CreateProductDTO } from './dtos/create-product.dto';
import { updatePorductDTO } from './dtos/update-product.dto';
import { ProductEntify } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntify)
    private readonly productRepository: Repository<ProductEntify>,
    private readonly categoryServive: CategoryService,
  ) {}

  async findAll(productId?: number[]): Promise<ProductEntify[]> {
    let findOptions = {};

    if (productId && productId.length > 0) {
      findOptions = {
        where: {
          id: In(productId),
        },
      };
    }

    const products = await this.productRepository.find(findOptions);

    if (!products || products.length === 0) {
      throw new NotFoundException('Not found products');
    }

    return products;
  }

  async findProductByListProductId() {}

  async createProduct(createProduct: CreateProductDTO): Promise<ProductEntify> {
    await this.categoryServive.findCategoryById(createProduct.categoryId);

    return this.productRepository.save({
      ...createProduct,
    });
  }

  async findProductById(productId: number): Promise<ProductEntify> {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product id: ${productId} not found`);
    }
    return product;
  }

  async deleteProduct(productId: number): Promise<DeleteResult> {
    await this.findProductById(productId);

    return this.productRepository.delete({ id: productId });
  }

  async updateProduct(
    updateProduct: updatePorductDTO,
    productId: number,
  ): Promise<ProductEntify> {
    const product = await this.findProductById(productId);

    return this.productRepository.save({
      ...product,
      ...updateProduct,
    });
  }
}
