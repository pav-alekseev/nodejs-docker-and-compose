import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { GeneralEntityProperties } from 'src/shared/common-properties-for-entitites';
import { User } from 'src/users/entities/users.entity';
import { Wish } from 'src/wishes/entities/wishes.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'offers' })
export class Offer extends GeneralEntityProperties {
  @IsNumber({}, { message: 'поле должно быть числом' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @IsOptional()
  @IsBoolean({ message: 'поле должно быть булевым значением' })
  @Column({ default: false })
  hidden: boolean;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;
}
