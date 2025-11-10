import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export async function validatePassword(user, password: string) {
  if (user && (await bcrypt.compare(password, user.password))) {
    const { password, ...result } = user;
    return result;
  }
  throw new UnauthorizedException('Неверное имя пользователя или пароля');
}
