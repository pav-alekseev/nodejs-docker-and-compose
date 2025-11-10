import { IsBoolean, IsNumber } from 'class-validator';

export class CreateOfferDto {
  @IsNumber({}, { message: 'поле должно быть числом' })
  amount: number;

  @IsBoolean({ message: 'поле должно быть булевым значением' })
  hidden: boolean;

  @IsNumber({}, { message: 'поле должно быть числом' })
  itemId: number;
}
