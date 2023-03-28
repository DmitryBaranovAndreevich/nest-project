import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { LocalGuard } from 'src/guard/local.quard';
import { TSignInUser } from 'src/interface/user';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';

@Controller('/')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async createUser(@Body() createUserDto: TSignInUser) {
    const user = await this.authService.createNewUser(createUserDto);
    if (user) {
      const token = await this.authService.login(user);
      return token;
    }
  }

  @UseGuards(LocalGuard)
  @Post('signin')
  async login(@Req() req: Request) {
    const user = req.user;
    const token = await this.authService.login(user as User);
    return token;
  }
}
