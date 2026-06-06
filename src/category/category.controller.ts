import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReturnCategory } from './dtos/return-category.dto';
import { CategoryService } from './category.service';
import { Roles } from '@/decorators/roles.decorator';
import { UserType } from '@/user/enum/user-type.enum';
import { CreateCategory } from './dtos/create-category.dto';
import { CategoryEntify } from './entities/category.entity';

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

    @Roles(UserType.Admin, UserType.User)
    @UsePipes(ValidationPipe)
    @Post()
    async createCategory(
        @Body() createCategory: CreateCategory,
    ): Promise<CategoryEntify>{
        return this.categoryService.createCategory(createCategory);
    }
}
