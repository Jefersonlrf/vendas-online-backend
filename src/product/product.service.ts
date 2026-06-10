import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntify } from './entities/product.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateProductDTO } from './dtos/create-product.dto';
import { CategoryService } from '@/category/category.service';

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(ProductEntify)
        private readonly productRepository: Repository<ProductEntify>,
        private readonly categoryServive: CategoryService,
    ) { }

    async findAll(): Promise<ProductEntify[]> {
        const products = await this.productRepository.find();

        if (!products || products.length === 0) {
            throw new NotFoundException('Not found products');
        }

        return products;
    }

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
}
