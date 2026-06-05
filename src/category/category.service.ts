import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntify } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {

    constructor(
        @InjectRepository(CategoryEntify)
        private readonly categoryRepository: Repository<CategoryEntify>,
    ) { }

    async findAllCategories(): Promise<CategoryEntify[]> {
        const categories = await this.categoryRepository.find();

        if (!categories || categories.length === 0) {
            throw new NotFoundException('Categories empty');
        }

        return categories;
    }
}
