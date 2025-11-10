import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wishes.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private readonly wishRepository: Repository<Wish>,
  ) {}

  async create(authorizedUser: User, dto: CreateWishDto) {
    return await this.wishRepository.save({ ...dto, owner: authorizedUser });
  }

  async findOne(query: FindOneOptions) {
    return await this.wishRepository.findOne(query);
  }

  async findOwnWishes(query: FindManyOptions) {
    return await this.wishRepository.find(query);
  }

  async findLast() {
    return await this.wishRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }

  async findTop() {
    return await this.wishRepository.find({
      order: { copied: 'DESC' },
      take: 20,
    });
  }

  async findMany(query: FindManyOptions) {
    return await this.wishRepository.find(query);
  }

  async updateOne(
    authorizedUser: User,
    query: FindOneOptions,
    dto: UpdateWishDto,
  ) {
    const { id, raised, owner, offers } = await this.findOne({
      ...query,
      relations: ['owner', 'offers'],
    });

    if (authorizedUser.id !== owner.id) {
      throw new ForbiddenException(
        'Нельзя удалить или изменить чужие пожелания',
      );
    }
    if (offers.length || !raised) {
      throw new ForbiddenException(
        'Нельзя удалить или изменить, пользователи уже внесли денежные средства',
      );
    }

    return await this.wishRepository.update(id, dto);
  }

  async updateRaised(id: number) {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });

    await this.wishRepository.save({
      ...wish,
      raised: wish.offers.reduce((sum, offer) => sum + +offer.amount, 0),
    });
  }

  async removeOne(query: FindOneOptions) {
    const wish = await this.findOne(query);

    if (+wish.raised) {
      throw new ForbiddenException(
        'Нельзя удалить или изменить, пользователи уже внесли денежные средства',
      );
    }
    return await this.wishRepository.delete(wish.id);
  }

  async copy(authorizedUser: User, query: FindOneOptions) {
    const originalWish = await this.findOne(query);

    if (authorizedUser.id === originalWish.owner.id) {
      throw new ForbiddenException('Нельзя копировать собственное пожелание');
    }

    originalWish.copied += 1;
    await this.wishRepository.save(originalWish);

    const { id, createdAt, updatedAt, copied, raised, ...copiedWish } =
      Object.assign(originalWish) as Wish;

    return await this.create(authorizedUser, copiedWish);
  }
}
