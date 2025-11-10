import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { RequestWithUser } from 'src/shared/types';
import { LocalGuard } from '../guards/local.guard';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    return await this.authService.register(dto);
  }

  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(@Req() req: RequestWithUser) {
    return await this.authService.authToken(req.user);
  }
}
