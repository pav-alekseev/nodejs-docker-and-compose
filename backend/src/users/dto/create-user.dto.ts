import { IsEmail, IsOptional, IsUrl, Length } from 'class-validator';

export class CreateUserDto {
  @Length(2, 30, {
    message: 'поле должно быть строкой и содержать от 2-х до 30-ти символов',
  })
  readonly username: string;

  @IsEmail({}, { message: 'поле должно быть email-ом' })
  readonly email: string;

  @Length(4, 16, {
    message: 'поле должно быть строкой и содержать от 4-х до 16-ти символов',
  })
  readonly password: string;

  @IsOptional()
  @Length(2, 200, {
    message: 'поле должно быть строкой и иметь от 2-х до 200-х символов',
  })
  readonly about: string;

  @IsOptional()
  @IsUrl({}, { message: 'поле должно быть ссылкой' })
  readonly avatar: string;
}
