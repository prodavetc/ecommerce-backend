import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';
import { UsersService } from '../users/users.service';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(
    private readonly service: OrdersService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(@Body() dto: CreateOrderDto, @Req() req: RequestWithUser) {
    const user = await this.usersService.findById(req.user!.userId);
    if (!user) {
      throw new Error('User not found');
    }
    return this.service.create(dto, user);
  }

  @Get()
  async getOwnOrders(@Req() req: RequestWithUser) {
    const user = await this.usersService.findById(req.user!.userId);
    if (!user) {
      throw new Error('User not found');
    }
    return this.service.findAllByUser(user);
  }
}
