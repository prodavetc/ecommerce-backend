import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImage } from './entities/product-image.entity';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ProductImagesService {
  constructor(
    @InjectRepository(ProductImage) private repo: Repository<ProductImage>,
    private productsService: ProductsService,
  ) {}

  async create(dto: CreateProductImageDto) {
    const product = await this.productsService.findById(dto.productId);
    if (!product) throw new NotFoundException('Producto no encontrado');

    const image = this.repo.create({ url: dto.url, product });
    return this.repo.save(image);
  }

  async findAllByProduct(productId: string) {
    return this.repo.find({
      where: { product: { id: productId } },
    });
  }
}
