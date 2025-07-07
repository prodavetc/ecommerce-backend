import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}

  create(dto: CreateCategoryDto): Promise<Category> {
    const category = this.repo.create(dto);
    return this.repo.save(category);
  }

  findAll(): Promise<Category[]> {
    return this.repo.find({ relations: ['products'] });
  }

  findById(id: string): Promise<Category | null> {
    return this.repo.findOne({ where: { id } });
  }
}
