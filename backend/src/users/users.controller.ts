import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/shared/types';
import { WishesService } from 'src/wishes/wishes.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @Get('me')
  async getMe(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Get('me/wishes')
  async getMyWishes(@Req() req: RequestWithUser) {
    return await this.wishesService.findOwnWishes({
      where: { owner: { id: req.user.id } },
      order: { createdAt: 'DESC' },
    });
  }

  @Patch('me')
  async updateMe(@Req() req: RequestWithUser, @Body() dto: UpdateUserDto) {
    return await this.usersService.updateOne(req.user.id, dto);
  }

  async getUsernameByWishes(@Param() param: { username: string }) {
    return await this.wishesService.findMany({ where: { owner: param } });
  }

  @Get(':username')
  async getUsername(@Param() param: { username: string }) {
    return await this.usersService.findOne({
      where: param,
      select: { password: false },
    });
  }

  @Post('find')
  async findMany(@Body() { query }) {
    return await this.usersService.findMany({
      where: [{ email: query }, { username: query }],
      select: { password: false },
    });
  }
}
