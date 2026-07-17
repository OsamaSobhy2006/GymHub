import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateSessionDto{
    @IsOptional()
    @IsString()
    @MaxLength(100)
    @ApiPropertyOptional({
        example: 'Upper Body Strength Training',
        description: 'Session title.',
    })
    title?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        example: 'A personalized one-on-one workout focusing on chest, shoulders, and arms.',
        description: 'Detailed description of the training session.',
    })
    description?: string;

    @IsOptional()
    @IsDateString()
    @ApiPropertyOptional({
        example: '2026-07-18'
    })
    date?: Date;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        example: '9.00'
    })
    startTime?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        example: '10.00'
    })
    endTime?: string;
}