import { IsNotEmpty, Length } from 'class-validator';
import { Wish } from 'src/wishes/entities/wish.entity';

export class CreateOfferDto {
  @IsNotEmpty()
  @Length(2, 30)
  name: string;

  @IsNotEmpty()
  amount: number;

  hidden: boolean;

  @IsNotEmpty()
  user: number;

  @IsNotEmpty()
  item: Wish;
}
