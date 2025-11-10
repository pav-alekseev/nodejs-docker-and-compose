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
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/shared/types';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishlistsService } from './wishlists.service';

@UseGuards(JwtAuthGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  async create(@Req() req: RequestWithUser, @Body() dto: CreateWishlistDto) {
    return await this.wishlistsService.create(req.user, dto);
  }

  @Get()
  async findAll() {
    return await this.wishlistsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.wishlistsService.findOne({
      where: { id },
      relations: ['items', 'owner'],
    });
  }

  @Patch(':id')
  async update(
    @Req() req: RequestWithUser,
    @Param('id') id: number,
    @Body() dto: UpdateWishlistDto,
  ) {
    return await this.wishlistsService.updateOne(req.user, id, dto);
  }

  @Delete(':id')
  async remove(@Req() req: RequestWithUser, @Param('id') id: number) {
    return await this.wishlistsService.removeOne(req.user, id);
  }
}
