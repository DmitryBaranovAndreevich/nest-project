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
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { JwtGuard } from 'src/guard/jwt.guard';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { DeepPartial, In } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wish } from 'src/wishes/entities/wish.entity';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(
    private readonly wishlistsService: WishlistsService,
    private readonly wishessService: WishesService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Req() req: Request,
    @Body() createWishlistDto: CreateWishlistDto,
  ) {
    const user = req.user as User;
    const { itemsId, ...all } = createWishlistDto;
    const items = (await this.wishessService.findAll({
      where: { id: In(itemsId) },
    })) as DeepPartial<Wish>;
    const newWishList = await this.wishlistsService.create({
      ...all,
      items,
      owner: user,
    });
    return newWishList;
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.wishlistsService.findAll({
      relations: ['owner', 'items'],
    });
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const wishesList = await this.wishlistsService.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
    return wishesList;
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.update(+id, updateWishlistDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.wishlistsService.remove(+id);
  }
}
