import { Roles } from '@/decorators/roles.decorator';
import { UserType } from '@/user/enum/user-type.enum';
import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';
import { ReturnProduct } from './dtos/return-product.dto';

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
}
