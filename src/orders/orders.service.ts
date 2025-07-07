// orders.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from '../dto/create-order.dto';
import { ProductsService } from '../products/products.service';
import { OrderItem } from './entities/order-item.entity';
import { User } from '../users/entities/user.entity';
// import { CreateOrderDto } from 'src/categories/dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepo: Repository<Order>,
    @InjectRepository(OrderItem) private itemsRepo: Repository<OrderItem>,
    private productsService: ProductsService,
  ) {}

  async create(dto: CreateOrderDto, user: User): Promise<Order> {
    let total = 0;
    const items: OrderItem[] = [];

    for (const itemDto of dto.items) {
      const product = await this.productsService.findById(itemDto.productId);
      if (!product)
        throw new NotFoundException(
          `Producto no encontrado: ${itemDto.productId}`,
        );

      const item = this.itemsRepo.create({
        product,
        quantity: itemDto.quantity,
        unitPrice: Number(product.price),
      });

      total += item.unitPrice * item.quantity;
      items.push(item);
    }

    const order = this.ordersRepo.create({
      user,
      totalAmount: total,
      status: 'pending',
      items,
    });

    return this.ordersRepo.save(order);
  }

  findAllByUser(user: User): Promise<Order[]> {
    return this.ordersRepo.find({
      where: { user: { id: user.id } },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Order | null> {
    return this.ordersRepo.findOne({ where: { id } });
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.ordersRepo.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }
    order.status = status;
    return this.ordersRepo.save(order);
  }
}
