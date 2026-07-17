import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class CreateMembershipDto {
    @IsUUID()
    @ApiProperty({
        example: 'e8d5c8d2-5e61-4d53-a6e8-f4f2a1f9b8d1',
        description: 'Member ID',
    })
    memberId!: string;

    @IsUUID()
    @ApiProperty({
        example: '6b1f2d2d-bc6b-4b5d-9a7e-9e2b1b9b7c11',
        description: 'Membership plan ID',
    })
    membershipPlanId!: string;
}