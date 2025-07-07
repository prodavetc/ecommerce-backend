import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private repo: Repository<Product>,
    private categoriesService: CategoriesService,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const category = await this.categoriesService.findById(dto.categoryId);
    if (!category) throw new NotFoundException('Categoría no encontrada');

    const product = this.repo.create({ ...dto, category });
    return this.repo.save(product);
  }

  findAll(): Promise<Product[]> {
    return this.repo.find({ relations: ['category'] });
  }

  findById(id: string): Promise<Product | null> {
    return this.repo.findOne({ where: { id }, relations: ['images'] });
  }
}
