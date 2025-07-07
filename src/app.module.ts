import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductImagesModule } from './product-images/product-images.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('PGHOST'),
        port: config.get<number>('PGPORT'),
        username: config.get<string>('PGUSER'),
        password: config.get<string>('PGPASSWORD'),
        database: config.get<string>('PGDATABASE'),
        entities: [__dirname + '/**/*.entity.{ts,js}'],
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    ProductImagesModule,
    OrdersModule,
    PaymentsModule,
  ],
})
export class AppModule {}
