import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reviews } from './entities/reviews.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateReviewDto } from './dtos/create-review.dto';
import { Role } from 'src/common/enums/role.enum';
import { UpdateReviewDto } from './dtos/update-review.dto';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Reviews)
        private readonly reviewRepo: Repository<Reviews>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {}

    async createReview(memberId: string, trainerId: string, createReviewDto: CreateReviewDto){
        const member = await this.userRepo.findOne({
            where: {
                id: memberId,
                role: Role.MEMBER
            }
        })

        if(!member) throw new NotFoundException('Member not found')

        const trainer = await this.userRepo.findOne({
            where: {
                id: trainerId,
                role: Role.TRAINER
            }
        })

        if(!trainer) throw new NotFoundException('Trainer not found')

        if(member.id === trainer.id) 
            throw new BadRequestException("you can't review yourself")

        const existingReview = await this.reviewRepo.findOne({
            where: {
                member: {id: member.id},
                trainer: {id: trainer.id}
            }
        })

        if(existingReview) throw new ConflictException('you already reviewed this trainer')
        
        const review = await this.reviewRepo.create({
            ...createReviewDto,
            member,
            trainer
        })

        return await this.reviewRepo.save(review)
    }

    async getAllReviews() {
        const reviews = await this.reviewRepo.find({
            relations: {
            member: true,
            trainer: true,
            },
            order: {
            createdAt: 'DESC',
            },
        });

        return {
            success: true,
            message: 'Reviews retrieved successfully.',
            data: reviews,
        };
    }

    async findTrainerReviews(trainerId: string) {
        const trainer = await this.userRepo.findOne({
            where: {
                id: trainerId,
                role: Role.TRAINER,
            },
        });

        if (!trainer)
            throw new NotFoundException('Trainer not found');

        const reviews = await this.reviewRepo.find({
            where: {
                trainer: {
                    id: trainerId,
                },
            },
            order: {
                createdAt: 'DESC',
            },
        });

        const totalReviews = reviews.length;

        const averageRating =
            totalReviews === 0
                ? 0
                : Number(
                    (
                        reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
                    ).toFixed(1),
                );

        return {
            averageRating,
            totalReviews,
            reviews,
        };
    }

    async updateReview(reviewId: string, memberId: string, updateReviewDto: UpdateReviewDto) {
        const review = await this.reviewRepo.findOne({
            where: {
                id: reviewId,
            },
        });

        if (!review)
            throw new NotFoundException('Review not found');

        if (review.member.id !== memberId)
            throw new ForbiddenException(
                'You can only update your own review.',
            );

        Object.assign(review, updateReviewDto);

        return await this.reviewRepo.save(review);
    }

    async deleteReview(reviewId: string, userId: string, role: Role) {
        const review = await this.reviewRepo.findOne({
            where: {
                id: reviewId,
            },
        });

        if (!review)
            throw new NotFoundException('Review not found');

        if (role !== Role.ADMIN && review.member.id !== userId) {
            throw new ForbiddenException(
                'You can only delete your own review.',
            );
        }

        await this.reviewRepo.remove(review);

        return {
            message: 'Review deleted successfully',
        };
    }
}
