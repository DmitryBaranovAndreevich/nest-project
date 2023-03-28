import { IsFQDN, IsNotEmpty, Length } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { DeepPartial } from 'typeorm';

export class CreateWishlistDto {
  @IsNotEmpty()
  @Length(1, 250)
  name: string;

  @IsFQDN()
  image: string;

  @Length(1500)
  description: string;

  @IsNotEmpty()
  owner: User;

  itemsId?: number[];

  items?: DeepPartial<Wish>;
}
