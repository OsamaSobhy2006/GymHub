import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/enums/role.enum';
import type{ Request } from 'express';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all reviews',
    description: 'Retrieve all trainer reviews.',
  })
  @ApiOkResponse({
    description: 'Reviews retrieved successfully.',
  })
  getAllReviews() {
    return this.reviewsService.getAllReviews();
  }

  @ApiBearerAuth()

  @ApiOperation({
    summary: 'Create trainer review',
    description: 'Allows a member to review a trainer.',
  })

  @ApiCreatedResponse({
    description: 'Review created successfully.',
  })

  @ApiBadRequestResponse({
    description: 'Validation failed.',
  })

  @ApiConflictResponse({
    description: 'You have already reviewed this trainer.',
  })

  @ApiNotFoundResponse({
    description: 'Trainer not found.',
  })

  @ApiForbiddenResponse({
    description: 'Only members can create reviews.',
  })
  @Post('trainers/:trainerId')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.MEMBER)
  async create (@Req() req: Request, @Param('trainerId', ParseUUIDPipe) trainerId: string, @Body() dto: CreateReviewDto) {
    const review = await this.reviewsService.createReview(
      req['user'].sub,
      trainerId,
      dto
    ) 
    return {
      message: "Review Created Successfully",
      data: review
    }
  }

  @ApiOperation({
    summary: 'Get trainer reviews',
    description: 'Returns all reviews for a specific trainer.',
  })

  @ApiOkResponse({
    description: 'Trainer reviews retrieved successfully.',
  })

  @ApiNotFoundResponse({
    description: 'Trainer not found.',
  })
  @Get('trainers/:trainerId')
  async findTrainerReviews(@Param('trainerId', ParseUUIDPipe) trainerId: string){
    return {
        message: 'Trainer reviews fetched successfully',
        data: await this.reviewsService.findTrainerReviews(
            trainerId,
        )
    }
  }

  @ApiBearerAuth()

  @ApiOperation({
    summary: 'Update review',
  })

  @ApiOkResponse({
    description: 'Review updated successfully.',
  })

  @ApiNotFoundResponse({
    description: 'Review not found.',
  })

  @ApiForbiddenResponse({
    description: 'You can only update your own review.',
  })
  @Patch(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.MEMBER)
  async update(@Param('id', ParseUUIDPipe) id: string,@Req() req: Request,@Body() dto: UpdateReviewDto) {
      return {
          message: 'Review updated successfully',
          data: await this.reviewsService.updateReview(
              id,
              req['user'].sub,
              dto
          )
      };
  }

  @ApiBearerAuth()

  @ApiOperation({
    summary: 'Delete review',
  })

  @ApiOkResponse({
    description: 'Review deleted successfully.',
  })

  @ApiNotFoundResponse({
    description: 'Review not found.',
  })

  @ApiForbiddenResponse({
    description: 'You can only delete your own review.',
  })
  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MEMBER)
  async delete(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
      return await this.reviewsService.deleteReview(
          id,
          req['user'].sub,
          req['user'].role,
      );
  }
}
