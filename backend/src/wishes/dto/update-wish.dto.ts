import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { CreateWishDto } from './create-wish.dto';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @IsOptional()
  raised: number;

  @IsOptional()
  copied: number;

  @IsOptional()
  offers: Offer[];
}
