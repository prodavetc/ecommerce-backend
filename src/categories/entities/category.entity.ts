// src/categories/entities/category.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
