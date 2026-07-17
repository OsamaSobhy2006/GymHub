import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserStatus } from 'src/common/enums/user-status.enum';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists.');
    }

    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      10,
    );

    const user = this.usersRepository.create(createUserDto);

    return await this.usersRepository.save(user);
  }

  async findOne(options: FindOneOptions<User>) {
    const user = await this.usersRepository.findOne(options);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  async getPublicTrainer(id: string) {

    return await this.usersRepository.findOne({

        where: {
            id,
            role: Role.TRAINER,
            status: UserStatus.ACTIVE
        },

        select: {

            id: true,
            fullname: true,
            email: true,
            profileImage: true,
            createdAt: true,
            role: true,
            status: true

        }

    });

}

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({
        where: { email },
    });
    }

  async findAll() {
    return await this.usersRepository.find();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne({
      where: {
        id,
      },
    });

    if (updateUserDto.email) {
      const existingUser = await this.usersRepository.findOne({
        where: {
          email: updateUserDto.email,
        },
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already exists.');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        10,
      );
    }

    Object.assign(user, updateUserDto);

    return await this.usersRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne({
      where: {
        id,
      },
    });

    user.status = UserStatus.INACTIVE

    return await this.usersRepository.save(user);
  }

  async getPublicTrainers() {
    const trainers = await this.usersRepository.find({
        where: {
            role: Role.TRAINER,
            status: UserStatus.ACTIVE
        },
        relations: {
            receivedReviews: true
        }
    });

    return trainers.map(trainer => {
        const totalReviews = trainer.receivedReviews.length;
        const averageRating =
            totalReviews === 0
                ? 0
                : trainer.receivedReviews.reduce(
                    (sum, review) => sum + review.rating,
                    0
                ) / totalReviews;

        return {

            id: trainer.id,

            fullname: trainer.fullname,

            profileImage: trainer.profileImage,

            averageRating: Number(averageRating.toFixed(1)),

            totalReviews,
            email: trainer.email

        };

    });

}
}