import { IsArray, IsOptional, IsUrl, Length } from 'class-validator';

export class UpdateWishlistDto {
  @IsOptional()
  @Length(1, 250, {
    message: 'поле должно быть строкой и содержать от 1-го до 250-ти символов',
  })
  name: string;

  @IsOptional()
  @Length(0, 1500, {
    message: 'поле должно быть строкой и содержать до 1500-ти символов',
  })
  description: string;

  @IsOptional()
  @IsUrl({}, { message: 'поле должно быть ссылкой' })
  image: string;

  @IsOptional()
  @IsArray({
    message: 'поле должно содержать массив чисел',
  })
  itemsId: number[];
}
