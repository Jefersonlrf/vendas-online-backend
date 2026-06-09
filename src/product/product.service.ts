import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntify } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(ProductEntify)
        private readonly productRepository: Repository<ProductEntify>,
    ) {}
    
    async findAll():Promise<ProductEntify[]>{
        const products=await this.productRepository.find();

        if (!products || products.length=== 0) {
            throw new NotFoundException('Not found products');            
        }

        return products;
    }
}
