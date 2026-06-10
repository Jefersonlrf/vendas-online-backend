import { Roles } from '@/decorators/roles.decorator';
import { UserType } from '@/user/enum/user-type.enum';
import { Body, Controller, Delete, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { ReturnProduct } from './dtos/return-product.dto';
import { ProductEntify } from './entities/product.entity';
import { CreateProductDTO } from './dtos/create-product.dto';
import { DeleteResult } from 'typeorm';

@Roles(UserType.Admin,UserType.User)
@Controller('product')
export class ProductController {

    constructor(private readonly productService: ProductService){}

    @Get()
    async findAll():Promise<ReturnProduct[]>{
        return (await this.productService.findAll()).map(
            (product)=> new ReturnProduct(product),
        )
    }

    @Roles(UserType.Admin)
    @UsePipes(ValidationPipe)
    @Post()
    async createProduct(@Body() createProduct:CreateProductDTO):Promise<ProductEntify>{
        return this.productService.createProduct(createProduct)
    }

    @Roles(UserType.Admin)
    @Delete('/:productId')
    async deleteProduct(@Param('productId') productId: number):Promise<DeleteResult>{
        return this.productService.deleteProduct(productId);
    }
}
