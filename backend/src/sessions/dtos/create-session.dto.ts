import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateSessionDto {
    @IsUUID()
    @ApiProperty({
        example: 'ee2c7dcf-4b12-41b5-938b-19bd139744d4',
    })
    memberId!: string;

    @IsUUID()
    @ApiProperty({
        example: '5c10c81d-95d2-4385-b97b-637a6d656da1',
    })
    trainerId!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @ApiProperty({
        example: 'Upper Body Strength Training',
        description: 'Session title.',
    })
    title!: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'A personalized one-on-one workout focusing on chest, shoulders, and arms.',
        description: 'Detailed description of the training session.',
    })
    description!: string;

    @IsDateString()
    @ApiProperty({
        example: '2026-07-15',
    })
    date!: Date;

    @IsString()
    @ApiProperty({
        example: '10:00',
    })
    startTime!: string;

    @IsString()
    @ApiProperty({
        example: '11:00',
    })
    endTime!: string;
}