import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/guard/jwt.guard';
import { User } from './entities/user.entity';
import { hash } from 'bcryptjs';
import { WishesService } from 'src/wishes/wishes.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @UseGuards(JwtGuard)
  @Get('/me')
  findMe(@Req() req: Request) {
    const user = req.user;
    const { password, ...result } = user as User;
    return result;
  }

  @UseGuards(JwtGuard)
  @Patch('/me')
  async updateUser(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const res = { ...req.user } as User;
    if ('id' in updateUserDto && updateUserDto?.id != res.id) {
      throw new NotFoundException(
        'Вы можете редактировать только свой профиль',
      );
    }
    for (const key in updateUserDto) {
      if (key === 'password') {
        const secretPass = await hash(updateUserDto[key], 10);
        res[key] = secretPass;
      } else {
        res[key] = updateUserDto[key];
      }
    }
    await this.usersService.update(res.id, res);
    const user = await this.usersService.findOne({
      where: { id: res.id },
    });
    return user;
  }

  @UseGuards(JwtGuard)
  @Get('/me/wishes')
  async findMeWishes(@Req() req: Request) {
    const user = req.user as User;
    const wishes = await this.wishesService.getAllUserWishes(user);
    return wishes;
  }

  @UseGuards(JwtGuard)
  @Get('/:username')
  async findOtherUser(@Param('username') username: string) {
    const user = await this.usersService.findOne({
      where: { username },
    });
    return user;
  }

  @UseGuards(JwtGuard)
  @Get('/:username/wishes')
  async findOtherUserWishes(@Param('username') username: string) {
    const user = await this.usersService.findOne({ where: { username } });
    const wishes = await this.wishesService.getAllUserWishes(user);
    return wishes;
  }

  @UseGuards(JwtGuard)
  @Post('/find')
  async findUser(@Body() findUserDto: { query: string }) {
    const users = await this.usersService.findAll({
      where: [{ username: findUserDto.query }, { email: findUserDto.query }],
    });
    return users;
  }
}
