import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImagesService } from './product-images.service';
import { ProductImagesController } from './product-images.controller';
import { ProductImage } from './entities/product-image.entity';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductImage]), // ✅ Inyecta el repositorio
    ProductsModule, // ✅ Permite usar ProductsService
  ],
  controllers: [ProductImagesController],
  providers: [ProductImagesService],
})
export class ProductImagesModule {}
