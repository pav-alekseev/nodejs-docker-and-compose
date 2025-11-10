import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { RequestWithUser } from 'src/shared/types';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Req() req: RequestWithUser, @Body() dto: CreateWishDto) {
    return await this.wishesService.create(req.user, dto);
  }

  @Get('last')
  async getLast() {
    return await this.wishesService.findLast();
  }

  @Get('top')
  async getTop() {
    return await this.wishesService.findTop();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getById(@Param('id') id: number) {
    return await this.wishesService.findOne({
      where: { id },
      relations: ['owner', 'offers', 'offers.user'],
      order: { createdAt: 'DESC' },
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Req() req: RequestWithUser,
    @Body() dto: UpdateWishDto,
    @Param('id') id: number,
  ) {
    return await this.wishesService.updateOne(req.user, { where: { id } }, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: number) {
    return await this.wishesService.removeOne({ where: { id } });
  }

  @Post(':id/copy')
  @UseGuards(JwtAuthGuard)
  async copy(@Req() req: RequestWithUser, @Param('id') id: number) {
    return await this.wishesService.copy(req.user, {
      where: { id },
      relations: ['owner'],
    });
  }
}
