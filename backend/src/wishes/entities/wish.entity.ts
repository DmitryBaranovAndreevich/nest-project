import { IsDate, IsFQDN, Length } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Entity,
  JoinColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';

@Entity()
export class Wish {
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

  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsFQDN()
  link: string;

  @Column()
  @IsFQDN()
  image: string;

  @Column({
    type: 'decimal',
    scale: 2,
  })
  price: number;

  @Column({
    type: 'decimal',
    scale: 2,
    default: 0,
  })
  raised: number;

  @Column()
  @Length(1, 1024)
  description: string;

  @Column({
    type: 'int',
    default: 0,
  })
  copied: number;

  @OneToMany(() => Offer, (offer) => offer.item, { onDelete: 'CASCADE' })
  @JoinColumn()
  offers: Offer[];

  @ManyToOne(() => User, (user) => user.wish)
  @JoinColumn()
  owner: User;

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items, {
    onDelete: 'CASCADE',
  })
  wishlist: Wishlist;
}
