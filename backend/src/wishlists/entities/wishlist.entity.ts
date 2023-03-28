import { IsDate, Length } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Entity,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsDate()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @IsDate()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'text',
  })
  @Length(1, 250)
  name: string;

  @Column({
    type: 'text',
  })
  image: string;

  @Column({
    type: 'text',
    default: '',
  })
  @Length(1500)
  description: string;

  @ManyToMany(() => Wish, (wish) => wish.wishlist, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  items: Wish;

  @ManyToOne(() => User, (user) => user.wishlists)
  @JoinColumn()
  owner: User;
}
