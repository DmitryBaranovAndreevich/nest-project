import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async updateAndSave(options) {
    return await this.wishRepository.save(options);
  }

  async create(createWishDto: CreateWishDto, user: User) {
    const wish = await this.wishRepository.save({
      ...createWishDto,
      owner: user,
    });
    return wish;
  }

  async getAllUserWishes(user: User) {
    return await this.findAll({
      relations: ['owner', 'offers'],
      where: { owner: { id: user.id } },
    });
  }

  async findAll(options: FindManyOptions<Wish>) {
    return await this.wishRepository.find(options);
  }

  async findOne(options: FindOneOptions<Wish>) {
    return await this.wishRepository.findOne(options);
  }

  async update(id: number, updateWishDto: Partial<UpdateWishDto>) {
    return await this.wishRepository.update({ id }, updateWishDto);
  }

  async remove(id: number) {
    const wish = JSON.parse(
      JSON.stringify(
        await this.findOne({
          where: { id },
          relations: ['owner', 'offers', 'offers.item'],
        }),
      ),
    );
    await this.wishRepository.delete({ id });
    return wish;
  }

  async isOwner(wishId: number, user: User) {
    const userWishes = await this.getAllUserWishes(user);
    const res = userWishes.some((el) => el.id == wishId);
    return res;
  }
}
