import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/enums/role.enum';
import { CreateSessionDto } from './dtos/create-session.dto';
import { UpdateSessionDto } from './dtos/update-session.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Sessions')
@ApiBearerAuth()
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @ApiOperation({
      summary: 'Create a training session',
      description: 'Create a new training session between a trainer and a member.',
  })

  @ApiCreatedResponse({
      description: 'Session created successfully.',
  })

  @ApiConflictResponse({
      description: 'Trainer already has another session at the same date and time.',
  })

  @ApiNotFoundResponse({
      description: 'Trainer or member not found.',
  })

  @ApiBadRequestResponse({
      description: 'Validation failed.',
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() dto: CreateSessionDto){
    const session = await this.sessionsService.create(dto)

    return {
      success: true,
      message: 'Session created successfully.',
      data: session
    }
  }

  @ApiOperation({
      summary: 'Get all sessions',
  })

  @ApiOkResponse({
      description: 'Sessions retrieved successfully.',
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAll(){
    const sessions = await this.sessionsService.findAll()

    return {
      success: true,
      message: 'Session retrieved successfully.',
      data: sessions
    }
  }

    @ApiOperation({
        summary: 'Get current member sessions',
        description: 'Retrieve all sessions assigned to the currently authenticated member.',
    })
    @ApiOkResponse({
        description: 'Member sessions retrieved successfully.',
    })
    @ApiBearerAuth()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.MEMBER)
    @Get('me')
    async findMemberSessions(@Req() req: Request) {

        const sessions = await this.sessionsService.findMemberSessions(
            req['user'].sub,
        );

        return {
            success: true,
            message: 'Your sessions retrieved successfully.',
            data: sessions,
        };
    }

    @ApiOperation({
        summary: 'Get current trainer sessions',
        description: 'Retrieve all sessions assigned to the currently authenticated trainer.',
    })
    @ApiOkResponse({
        description: 'Trainer sessions retrieved successfully.',
    })
    @ApiBearerAuth()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.TRAINER)
    @Get('trainer')
    async findTrainerSessions(@Req() req: Request) {

        const sessions = await this.sessionsService.findTrainerSessions(
            req['user'].sub,
        );

        return {
            success: true,
            message: 'Trainer sessions retrieved successfully.',
            data: sessions,
        };
    }

  @ApiOperation({
      summary: 'Get session by id',
  })

  @ApiOkResponse({
      description: 'Session retrieved successfully.',
  })

  @ApiNotFoundResponse({
      description: 'Session not found.',
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Get(':id')
  async fineOne(@Param('id', ParseUUIDPipe) id: string) {
    const session = await this.sessionsService.findOne(id)

    return {
      success: true,
      message: 'Session retrieved successfully.',
      data: session
    }
  }

  @ApiOperation({
      summary: 'Update session',
  })

  @ApiOkResponse({
      description: 'Session updated successfully.',
  })

  @ApiConflictResponse({
      description: 'Trainer already has another session at this time.',
  })

  @ApiBadRequestResponse({
      description: 'Cancelled or completed sessions cannot be updated.',
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateSessionDto){
    const session = await this.sessionsService.update(id, dto)

    return {
      success: true,
      message: 'Session Updated successfully',
      data: session
    }
  }

  @ApiOperation({
      summary: 'Cancel session',
  })

  @ApiOkResponse({
      description: 'Session cancelled successfully.',
  })

  @ApiBadRequestResponse({
      description: 'Session is already cancelled or completed.',
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MEMBER)
  @Patch(':id/cancel')
  async cancel(@Param('id', ParseUUIDPipe) id: string){
    const session = await this.sessionsService.remove(id)

    return {
      success: true,
      message: 'Session cancelled successfully',
      data: session
    }
  }


}
