import { IsNumber, IsOptional, IsUrl, Length } from 'class-validator';
import { GeneralEntityProperties } from 'src/shared/common-properties-for-entitites';
import { Offer } from 'src/offers/entities/offers.entity';
import { User } from 'src/users/entities/users.entity';
import { Wishlist } from 'src/wishlists/entities/wishlists.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'wishes' })
export class Wish extends GeneralEntityProperties {
  @Length(1, 250, {
    message: 'поле должно быть строкой и содержать от 1-го до 250-ти символов',
  })
  @Column()
  name: string;

  @IsUrl({}, { message: 'поле должно быть ссылкой' })
  @Column()
  link: string;

  @IsUrl({}, { message: 'поле должно быть ссылкой' })
  @Column()
  image: string;

  @IsNumber({ maxDecimalPlaces: 10 }, { message: 'поле должно быть цифрой' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @IsOptional()
  @Length(1, 1024, {
    message: 'поле должно быть строкой и содержать от 1-го до 1024-х символов',
  })
  @Column({ nullable: true })
  description: string;

  @IsNumber({ maxDecimalPlaces: 10 }, { message: 'поле должно быть цифрой' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  raised: number;

  @IsNumber({}, { message: 'поле должно быть цифрой' })
  @Column({ default: 0 })
  copied: number;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  wishlist: Wishlist[];
}
