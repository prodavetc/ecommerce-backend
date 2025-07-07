import { IsUUID, IsUrl } from 'class-validator';

export class CreateProductImageDto {
  @IsUUID()
  productId: string;

  @IsUrl()
  url: string;
}
