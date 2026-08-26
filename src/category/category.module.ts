import { ProductModule } from '@/product/product.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryEntify } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntify]), ProductModule],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
