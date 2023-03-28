import { IsFQDN, IsNotEmpty, Length } from 'class-validator';

export class CreateWishDto {
  @IsNotEmpty()
  @Length(1, 250)
  name: string;

  @IsNotEmpty()
  @IsFQDN()
  link: string;

  @IsNotEmpty()
  @IsFQDN()
  image: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  @Length(1, 1024)
  description: string;
}
