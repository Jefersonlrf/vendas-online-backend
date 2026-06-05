import { Controller, Get } from '@nestjs/common';
import { ReturnCategory } from './dtos/return-category.dto';
import { CategoryService } from './category.service';
import { Roles } from '@/decorators/roles.decorator';
import { UserType } from '@/user/enum/user-type.enum';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService){}

    @Roles(UserType.Admin, UserType.User)
    @Get()
    async findAllCategories():Promise<ReturnCategory[]>{
        return (await this.categoryService.findAllCategories()).map(
            (category) =>new ReturnCategory(category),
        );
    }
}
