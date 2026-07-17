import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

import { Role } from 'src/common/enums/role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Osama Sobhy',
    description: 'Full name of the user',
  })
  fullname!: string;

  @IsEmail()
  @ApiProperty({
    example: 'osama@gmail.com',
    description: 'Unique email address',
  })
  email!: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({
    example: 'Osama@123'
  })
  password!: string;

  @IsEnum(Role)
  @ApiProperty({
    enum: Role,
    example: Role.TRAINER,
    description: 'User role',
  })
  role!: Role;
}