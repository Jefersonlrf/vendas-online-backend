import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntify } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDTO } from './dtos/create-product.dto';
import { CategoryService } from '@/category/category.service';

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(ProductEntify)
        private readonly productRepository: Repository<ProductEntify>,
        private readonly categoryServive: CategoryService,
    ) {}
    
    async findAll():Promise<ProductEntify[]>{
        const products=await this.productRepository.find();

        if (!products || products.length=== 0) {
            throw new NotFoundException('Not found products');            
        }

        return products;
    }

    async createProduct(createProduct:CreateProductDTO):Promise<ProductEntify>{
        await this.categoryServive.findCategoryById(createProduct.categoryId);

        return this.productRepository.save({
            ...createProduct,
        });
    }
}
