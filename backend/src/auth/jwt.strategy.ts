import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
    });
  }
  async validate(payload: { sub: number }) {
    const user = await this.userService.findOne({ where: { id: payload.sub } });
    if (!user) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
    const { password, ...result } = user;
    return result;
  }
}
