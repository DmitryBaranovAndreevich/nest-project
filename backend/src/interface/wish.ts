import { Offer } from 'src/offers/entities/offer.entity';

export type TCreateWishDTO = {
  name: string;
  link: string;
  image: string;
  price: number;
  description: string;
};

export type TUpdateWish = Partial<TCreateWishDTO> & {
  raised?: number;
  copied?: number;
  offers?: Offer[];
};
