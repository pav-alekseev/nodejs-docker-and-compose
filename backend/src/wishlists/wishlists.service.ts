import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlists.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(authorizedUser: User, dto: CreateWishlistDto) {
    const wishes = await this.wishesService.findMany({});
    const findWishes = wishes.filter((wish) => dto.itemsId.includes(wish.id));

    return await this.wishlistRepository.save({
      ...dto,
      owner: authorizedUser,
      items: findWishes,
    });
  }

  async findAll() {
    return await this.wishlistRepository.find();
  }

  async findOne(query: FindOneOptions) {
    return await this.wishlistRepository.findOne(query);
  }

  async updateOne(authorizedUser: User, id: number, dto: UpdateWishlistDto) {
    const findWishlist = await this.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (findWishlist.owner.id !== authorizedUser.id) {
      throw new ForbiddenException(
        'Нельзя удалить или изменить чужую подборку пожеланий',
      );
    }
    return await this.wishlistRepository.update(id, dto);
  }

  async removeOne(authorizedUser: User, id: number) {
    const findWishlist = await this.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (findWishlist.owner.id !== authorizedUser.id) {
      throw new ForbiddenException(
        'Нельзя удалить или изменить чужую подборку пожеланий',
      );
    }
    return await this.wishlistRepository.delete(id);
  }
}
