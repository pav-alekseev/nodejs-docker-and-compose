import { IsArray, IsOptional, IsUrl, Length } from 'class-validator';
import { GeneralEntityProperties } from 'src/shared/common-properties-for-entitites';
import { User } from 'src/users/entities/users.entity';
import { Wish } from 'src/wishes/entities/wishes.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity({ name: 'wishlists' })
export class Wishlist extends GeneralEntityProperties {
  @Length(1, 250, {
    message: 'поле должно быть строкой и содержать от 1-го до 250-ти символов',
  })
  @Column()
  name: string;

  @IsOptional()
  @Length(0, 1500, {
    message: 'поле должно быть строкой и содержать до 1500-ти символов',
  })
  @Column({ nullable: true })
  description: string;

  @IsOptional()
  @IsUrl({}, { message: 'поле должно быть ссылкой' })
  @Column()
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @IsArray({
    message: 'поле должно содержать массив чисел',
  })
  @ManyToMany(() => Wish, (wish) => wish.wishlist, { cascade: true })
  @JoinTable()
  items: Wish[];
}
