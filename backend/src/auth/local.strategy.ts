import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { validatePassword } from 'src/shared/validate-password';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super();
  }
  async validate(username: string, password: string) {
    const user = await this.userService.findOne({ where: { username } });
    return await validatePassword(user, password);
  }
}
