import { IsEmail, IsFQDN, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(2, 30)
  username: string;

  @IsNotEmpty()
  @Length(2, 200)
  about: string;

  @IsNotEmpty()
  @IsFQDN()
  avatar: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
