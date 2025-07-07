import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import paypal = require('@paypal/checkout-server-sdk');
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentsService {
  private mercadopago: MercadoPagoConfig;
  private payPalEnv: any;
  private payPalClient: any;

  constructor(private configService: ConfigService) {
    this.mercadopago = new MercadoPagoConfig({
      accessToken: this.configService.get<string>('MP_ACCESS_TOKEN')!,
    });

    this.payPalEnv = new paypal.core.SandboxEnvironment(
      this.configService.get('PAYPAL_CLIENT_ID'),
      this.configService.get('PAYPAL_CLIENT_SECRET'),
    );

    this.payPalClient = new paypal.core.PayPalHttpClient(this.payPalEnv);
  }

  async createPayPalOrder(orderId: string, amount: number) {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: orderId,
          amount: {
            currency_code: 'USD',
            value: amount.toFixed(2),
          },
        },
      ],
      application_context: {
        return_url: 'https://tu-sitio.com/paypal/success',
        cancel_url: 'https://tu-sitio.com/paypal/cancel',
      },
    });

    const response = await this.payPalClient.execute(request);
    return response.result;
  }

  async createPreference(orderId: string, amount: number) {
    const preference = {
      items: [
        {
          id: orderId,
          title: `Pedido ${orderId}`,
          unit_price: Number(amount),
          quantity: 1,
        },
      ],
      back_urls: {
        success: 'https://tu-sitio.com/success',
        failure: 'https://tu-sitio.com/failure',
        pending: 'https://tu-sitio.com/pending',
      },
      auto_return: 'approved',
      external_reference: orderId,
    };

    const result = await new Preference(this.mercadopago).create({
      body: preference,
    });
    return result;
  }
}
