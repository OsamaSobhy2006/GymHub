import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    @IsNotEmpty()
    @ApiProperty({
        example: 'Osama Sobhy',
    })
    fullname!: string;

    @IsEmail()
    @ApiProperty({
        example: 'osama@gmail.com',
    })
    email!: string;

    @IsString()
    @MinLength(8)
    @MaxLength(100)
    @ApiProperty({
        example: 'Osama@123',
    })
    password!: string;


}