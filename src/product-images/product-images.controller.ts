import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ProductImagesService } from './product-images.service';
import { CreateProductImageDto } from './dto/create-product-image.dto';

@Controller('product-images')
export class ProductImagesController {
  constructor(private readonly service: ProductImagesService) {}

  @Post()
  create(@Body() dto: CreateProductImageDto) {
    return this.service.create(dto);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.service.findAllByProduct(productId);
  }
}
