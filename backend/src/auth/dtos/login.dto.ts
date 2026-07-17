import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsEmail()
    @ApiProperty({
        example: 'osama@gmail.com',
    })
    email!: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Osama@123',
    })
    password!: string;
}