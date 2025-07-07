import { Controller, Get, Post, Body } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
