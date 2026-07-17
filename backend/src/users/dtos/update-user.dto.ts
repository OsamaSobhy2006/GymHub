import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { Role } from 'src/common/enums/role.enum';
import { UserStatus } from 'src/common/enums/user-status.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
      example: 'Osama Sobhy',
  })
  fullname?: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({
    example: 'osama@gmail.com',
  })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @ApiPropertyOptional({
    example: 'Osama@123'
  })
  password?: string;

  @IsOptional()
  @IsEnum(Role)
  @ApiPropertyOptional({
    enum: Role,
    example: Role.TRAINER
  })
  role?: Role;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: '/uploads/profile/image.jpg'
  })
  profileImage?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  @ApiPropertyOptional({
    enum: UserStatus,
    example: UserStatus.ACTIVE,
    description: 'User account status',
  })
  status?: UserStatus;
}