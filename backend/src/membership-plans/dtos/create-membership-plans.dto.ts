import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateMemberShipPlanDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Premium',
        description: 'Membership plan name',
    })
    name!: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Unlimited access to the gym',
    })
    description!: string;

    @IsNumber()
    @IsPositive()
    @ApiProperty({
        example: 999,
        description: 'Membership price',
    })
    price!: number;

    @IsNumber()
    @IsPositive()
    @ApiProperty({
        example: 30,
        description: 'Duration of the plan'
    })
    durationInDays!: number;

    @IsOptional()
    @IsBoolean()
    @ApiPropertyOptional({
        example: true
    })
    isActive?: boolean;
}