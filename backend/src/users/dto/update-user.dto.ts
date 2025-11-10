import { IsEmail, IsOptional, Length } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends CreateUserDto {
  @IsOptional()
  @Length(2, 30, {
    message: 'поле должно быть строкой и содержать от 2-х до 30-ти символов',
  })
  readonly username: string;

  @IsOptional()
  @IsEmail({}, { message: 'поле должно быть email-ом' })
  readonly email: string;

  @IsOptional()
  @Length(4, 16, {
    message: 'поле должно быть строкой и содержать от 4-х до 16-ти символов',
  })
  readonly password: string;
}
