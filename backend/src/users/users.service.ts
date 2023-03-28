import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findWithPass(username: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .where({ username })
      .select([
        'user.id',
        'user.createdAt',
        'user.updatedAt',
        'user.username',
        'user.about',
        'user.avatar',
        'user.email',
        'user.password',
      ])
      .getOne();
  }

  async findOne(options: FindOneOptions<User>) {
    return await this.usersRepository.findOne(options);
  }

  findAll(options: FindManyOptions<User>) {
    return this.usersRepository.find(options);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update({ id }, updateUserDto);
  }

  remove(id: number) {
    return this.usersRepository.delete({ id });
  }
}
