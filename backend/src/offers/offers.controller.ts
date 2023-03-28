import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  NotImplementedException,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { JwtGuard } from 'src/guard/jwt.guard';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { ICreateOfferDTO } from 'src/interface/offer';

@Controller('offers')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
    private readonly wishesService: WishesService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(@Req() req: Request, @Body() createOfferDto: ICreateOfferDTO) {
    const { itemId, ...all } = createOfferDto;
    const user = req.user as User;
    const { id, username } = user;
    const item = await this.wishesService.findOne({ where: { id: itemId } });
    if (!(await this.wishesService.isOwner(itemId, user))) {
      const sum =
        item.price - item.raised > all.amount
          ? all.amount
          : item.price - item.raised;
      if (+item.raised < +item.price) {
        await this.wishesService.update(itemId, {
          raised: Number(item.raised) + Number(sum),
        });
        const offer = await this.offersService.create({
          ...all,
          amount: sum,
          user: id,
          item: item,
          name: username,
        });
        return offer;
      } else {
        throw new NotImplementedException('Вся сумма уже собрана');
      }
    } else {
      throw new NotImplementedException('Вы не можете донатить на свою вещь');
    }
  }

  @UseGuards(JwtGuard)
  @Get()
  async findAll() {
    const offers = this.offersService.findAll({
      relations: ['item', 'item.offers', 'item.owner'],
    });
    return offers;
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const offers = await this.offersService.findAll({
      relations: ['item'],
      where: { item: { id } },
    });
    return offers;
  }
}
