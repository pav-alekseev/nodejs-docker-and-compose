import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offers.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(authorizedUser: User, dto: CreateOfferDto) {
    const wish = await this.wishesService.findOne({
      where: { id: dto.itemId },
      relations: ['owner', 'offers'],
    });

    if (authorizedUser.id === wish.owner.id) {
      throw new ForbiddenException(
        'Нельзя внести денежные средства на собственное пожелание',
      );
    }

    if (dto.amount > +wish.price || dto.amount + +wish.raised > +wish.price) {
      throw new ForbiddenException(
        'Нельзя внести денежные средства если превышают стоимость пожелания',
      );
    }

    const offer = await this.offerRepository.save({
      ...dto,
      item: wish,
      user: dto.hidden ? authorizedUser : null,
    });

    await this.wishesService.updateRaised(wish.id);
    return offer;
  }

  async findOne(query: FindOneOptions) {
    return await this.offerRepository.findOne(query);
  }

  async findAll() {
    return await this.offerRepository.find();
  }
}
