// src/payments/payments.controller.ts
import { Controller, Post, Param, UseGuards, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { OrdersService } from '../orders/orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(
    private paymentsService: PaymentsService,
    private ordersService: OrdersService,
  ) {}

  @Post('mercadopago/:orderId')
  async createMercadoPagoPreference(
    @Param('orderId') orderId: string,
  ): Promise<ReturnType<PaymentsService['createPreference']>> {
    const order = await this.ordersService.findById(orderId);
    if (!order) {
      throw new Error('Orden no encontrada');
    }

    return this.paymentsService.createPreference(
      order.id,
      Number(order.totalAmount),
    );
  }

  @Post('mercadopago/webhook')
  async mercadoPagoWebhook(@Req() req, @Res() res) {
    const payment = req.body;

    const orderId = payment?.data?.id || payment?.external_reference;

    if (!orderId) {
      return res.status(400).send('No order id');
    }

    await this.ordersService.updateStatus(orderId, 'paid');

    return res.status(200).send('OK');
  }

  @Post('paypal/:orderId')
  async createPayPal(@Param('orderId') orderId: string) {
    const order = await this.ordersService.findById(orderId);
    if (!order) {
      throw new Error('Orden no encontrada');
    }

    return this.paymentsService.createPayPalOrder(
      order.id,
      Number(order.totalAmount),
    );
  }
}
