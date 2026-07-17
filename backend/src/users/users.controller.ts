import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/guards/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/common/multer/multer.config';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConflictResponse, ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

    @ApiOperation({
      summary: 'Create a new user',
      description: 'Create a new member or trainer.',
    })

    @ApiCreatedResponse({
      description: 'User created successfully.',
    })

    @ApiBadRequestResponse({
      description: 'Validation failed.',
    })

    @ApiConflictResponse({
      description: 'Email already exists.',
    })

    @ApiUnauthorizedResponse({
      description: 'Unauthorized.',
    })

    @ApiForbiddenResponse({
      description: 'Only admins can create users.',
    })
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    create(@Body() userData: CreateUserDto) {
      return this.usersService.create(userData)
    }


    @ApiOperation({
      summary: 'Get all users',
    })

    @ApiOkResponse({
      description: 'Users retrieved successfully.',
    })

    @ApiUnauthorizedResponse({
      description: 'Unauthorized.',
    })

    @ApiForbiddenResponse({
      description: 'Only admins can access this endpoint.',
    })
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    findAll() {
      return this.usersService.findAll()
    }

    @ApiOperation({
      summary: 'Get public trainers',
      description: 'Retrieve the latest active trainers for the public landing page.',
    })

    @ApiOkResponse({
      description: 'Public trainers retrieved successfully.',
    })
    @Get('trainers')
    async getTrainers(){
      return this.usersService.getPublicTrainers()
    }

    @ApiOperation({
      summary: 'Upload profile image',
    })

    @ApiBearerAuth()

    @ApiConsumes('multipart/form-data')

    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          'profile-image': {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })

    @ApiOkResponse({
      description: 'Profile image uploaded successfully.',
    })
    @Patch('profile-image')
    @UseGuards(JwtGuard)
    @UseInterceptors(FileInterceptor('profile-image', multerConfig))
    async uploadProfileImage(@CurrentUser() user: JwtPayload, @UploadedFile() file: Express.Multer.File){
      return await this.usersService.update(user.sub, {
        profileImage: `/uploads/profile/${file.filename}`
      })
    }

    

    @ApiOperation({
      summary: 'Get user by id',
    })

    @ApiOkResponse({
      description: 'User retrieved successfully.',
    })

    @ApiNotFoundResponse({
      description: 'User not found.',
    })
    @UseGuards(JwtGuard, RolesGuard)
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string){
      return this.usersService.findOne( { where: { id } })
    }

    @ApiOperation({
      summary: 'Get Public Trainers',
    })

    @ApiOkResponse({
      description: 'Trainers retrived successfully.',
    })
    @Get('/trainers/:id')
    getPublicTrainer(
        @Param('id', ParseUUIDPipe) id: string
    ){
        return this.usersService.getPublicTrainer(id);
    }

    @ApiOperation({
      summary: 'Update user',
    })

    @ApiOkResponse({
      description: 'User updated successfully.',
    })

    @ApiNotFoundResponse({
      description: 'User not found.',
    })
    @UseGuards(JwtGuard, RolesGuard)
    @Patch(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() userData: UpdateUserDto) {
      return this.usersService.update(id, userData)
    }

    @ApiOperation({
      summary: 'Delete user',
    })

    @ApiOkResponse({
      description: 'User deleted successfully.',
    })

    @ApiNotFoundResponse({
      description: 'User not found.',
    })
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string){
      return this.usersService.remove(id)
    }

    

}

