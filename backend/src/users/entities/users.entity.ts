import { IsArray, IsEmail, IsOptional, IsUrl, Length } from 'class-validator';
import { GeneralEntityProperties } from 'src/shared/common-properties-for-entitites';
import { Offer } from 'src/offers/entities/offers.entity';
import { Wish } from 'src/wishes/entities/wishes.entity';
import { Wishlist } from 'src/wishlists/entities/wishlists.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'users' })
export class User extends GeneralEntityProperties {
  @Length(2, 30, {
    message: 'поле должно быть строкой и содержать от 2-х до 30-ти символов',
  })
  @Column({ unique: true })
  username: string;

  @IsEmail({}, { message: 'поле должно быть email-ом' })
  @Column({ unique: true })
  email: string;

  @Length(4, 16, {
    message: 'поле должно быть строкой и содержать от 4-х до 16-ти символов',
  })
  @Column()
  password: string;

  @IsOptional()
  @Length(2, 200, {
    message: 'поле должно быть строкой и иметь от 2-х до 200-х символов',
  })
  @Column({ default: 'Пока ничего не рассказал о себе' })
  about: string;

  @IsOptional()
  @IsUrl({}, { message: 'поле должно быть ссылкой' })
  @Column({ default: 'https://i.pravatar.cc/300' })
  avatar: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlists) => wishlists.owner)
  wishlists: Wishlist[];
}
