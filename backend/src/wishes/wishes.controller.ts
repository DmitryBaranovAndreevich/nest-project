import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  NotImplementedException,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { JwtGuard } from 'src/guard/jwt.guard';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(@Req() req: Request, @Body() createWishDto: CreateWishDto) {
    const user = req.user as User;
    await this.wishesService.create(createWishDto, user);
    return {};
  }

  @Get('/last')
  async findAll() {
    const wishes = await this.wishesService.findAll({
      order: { createdAt: 'DESC' },
      take: 40,
    });
    return wishes;
  }

  @Get('/top')
  async findTop() {
    const wishes = await this.wishesService.findAll({
      order: { copied: 'DESC' },
      take: 10,
    });
    return wishes;
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findWish(@Param('id') id: number) {
    const wish = await this.wishesService.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });
    return wish;
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    if (await this.wishesService.isOwner(id, user)) {
      const { raised, copied, offers: upOffers, ...any } = updateWishDto;
      let dto = any;
      const { offers } = await this.wishesService.findOne({
        where: { id },
        relations: ['offers'],
      });
      if (offers.length != 0) {
        const { price, ...all } = any;
        dto = all;
      }

      await this.wishesService.update(+id, dto);
      return {};
    } else {
      throw new NotImplementedException(
        'Вы не являетесь владельцев данной вещи',
      );
    }
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req: Request) {
    const user = req.user as User;
    if (await this.wishesService.isOwner(id, user)) {
      return await this.wishesService.remove(+id);
    } else {
      throw new NotImplementedException(
        'Вы не являетесь владельцев данной вещи',
      );
    }
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copy(@Param('id') id: number, @Req() req: Request) {
    const user = req.user as User;
    const {
      id: Id,
      copied,
      ...all
    } = await this.wishesService.findOne({
      where: { id },
    });
    const { link, image, name, price, description } =
      await this.wishesService.updateAndSave({
        id: Id,
        ...all,
        copied: copied + 1,
      });
    await this.wishesService.create(
      { link, image, name, price, description },
      user,
    );
    return {};
  }
}
