// src/products/entities/product.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { OneToMany } from 'typeorm';
import { ProductImage } from '../../product-images/entities/product-image.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  stock: number;

  @Column({ nullable: true })
  imageUrl: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
  images: ProductImage[];
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
