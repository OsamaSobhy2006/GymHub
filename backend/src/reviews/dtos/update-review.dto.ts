import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsInt,
    IsOptional,
    IsString,
    Max,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';

export class UpdateReviewDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    @ApiPropertyOptional({
        example: 5,
        minimum: 1,
        maximum: 5,
        description: 'Rating from 1 to 5',
    })
    rating?: number;

    @IsOptional()
    @IsString()
    @MinLength(5)
    @MaxLength(500)
    @ApiPropertyOptional({
        example: 'Excellent trainer, very professional.',
        description: 'Review comment',
        minLength: 5,
        maxLength: 500,
    })
    comment?: string;
}