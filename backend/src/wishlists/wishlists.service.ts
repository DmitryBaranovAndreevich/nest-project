import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { FindManyOptions, FindOneOptions, In, Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishListRepository: Repository<Wishlist>,
    private wishessService: WishesService,
  ) {}

  async create(createWishlistDto: CreateWishlistDto) {
    return await this.wishListRepository.save(createWishlistDto);
  }

  findAll(options: FindManyOptions<Wishlist>) {
    return this.wishListRepository.find(options);
  }

  findOne(options: FindOneOptions<Wishlist>) {
    return this.wishListRepository.findOne(options);
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto) {
    const { itemsId, ...all } = updateWishlistDto;
    const wishlist = await this.findOne({
      where: { id },
      relations: ['items', 'owner'],
    });
    if (itemsId && itemsId.length) {
      const items = await this.wishessService.findAll({
        where: { id: In(itemsId) },
      });

      const actualRelationsItems = await this.wishListRepository
        .createQueryBuilder()
        .relation(Wishlist, 'items')
        .of(wishlist)
        .loadMany();

      await this.wishListRepository
        .createQueryBuilder()
        .relation(Wishlist, 'items')
        .of(wishlist)
        .addAndRemove(items, actualRelationsItems);
    }
    await this.wishListRepository.update({ id }, all);

    return await this.findOne({ where: { id }, relations: ['owner', 'items'] });
  }

  async remove(id: number) {
    const result = JSON.parse(
      JSON.stringify(
        await this.findOne({
          where: { id },
          relations: ['owner', 'items'],
        }),
      ),
    );
    await this.wishListRepository.delete({ id });
    return result;
  }
}
