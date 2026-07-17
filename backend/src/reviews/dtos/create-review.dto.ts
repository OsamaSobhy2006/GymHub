import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateReviewDto {

  @IsInt()
  @Min(1)
  @Max(5)
  @ApiProperty({
      example: 5,
      minimum: 1,
      maximum: 5,
      description: 'Rating between 1 and 5',
  })
  rating!: number;

  @IsString()
  @MinLength(5)
  @MaxLength(500)
  @ApiProperty({
    example: 'Excellent trainer with great communication skills.',
    description: 'Review comment',
  })
  comment!: string;
}