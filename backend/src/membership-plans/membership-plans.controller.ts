import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { MembershipPlansService } from './membership-plans.service';
import { CreateMemberShipPlanDto } from './dtos/create-membership-plans.dto';
import { UpdateMembershipPlanDto } from './dtos/update-membership-plans.dts';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/enums/role.enum';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('Membership Plans')
@ApiBearerAuth()
@Controller('membership-plans')
export class MembershipPlansController {
  constructor(private readonly membershipPlansService: MembershipPlansService) {}

  @ApiOperation({
    summary: 'Get all membership plans',
  })

  @ApiOkResponse({
      description: 'Membership plans retrieved successfully.',
  })
  @Get()
  async getAll(){
    const plans = await this.membershipPlansService.findAll()

    return {
      success: true,
      message: 'Membership plans retrieved successfully.',
      data: plans,
    };
  }

  @ApiOperation({
    summary: 'Create membership plan',
    description: 'Create a new membership plan.',
  })

  @ApiCreatedResponse({
      description: 'Membership plan created successfully.',
  })

  @ApiBadRequestResponse({
      description: 'Validation failed.',
  })

  @ApiConflictResponse({
      description: 'Membership plan already exists.',
  })

  @ApiUnauthorizedResponse({
      description: 'Unauthorized.',
  })

  @ApiForbiddenResponse({
      description: 'Only admins can create membership plans.',
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() membershipPlanData: CreateMemberShipPlanDto){
    const plan = await this.membershipPlansService.create(membershipPlanData)

    return {
      success: true,
      message: 'Membership plan created successfully.',
      data: plan,
    }
  }

  @ApiOperation({
    summary: 'Get membership plan by id',
  })

  @ApiOkResponse({
      description: 'Membership plan retrieved successfully.',
  })

  @ApiNotFoundResponse({
      description: 'Membership plan not found.',
  })
  @Get(':id')
  async getOne(@Param('id', ParseUUIDPipe) id: string){
    const plan = await this.membershipPlansService.findOne(id);

    return {
      success: true,
      message: 'Membership plan retrieved successfully.',
      data: plan,
  };
  } 

  @ApiOperation({
    summary: 'Update membership plan',
  })

  @ApiOkResponse({
      description: 'Membership plan updated successfully.',
  })

  @ApiNotFoundResponse({
      description: 'Membership plan not found.',
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() membershipPlanData: UpdateMembershipPlanDto){
    const updatedPlan = await this.membershipPlansService.update(id, membershipPlanData)

    return {
      success: true,
      message: 'Membership plan updated successfully.',
      data: updatedPlan,
  };
  }

  @ApiOperation({
    summary: 'Delete membership plan',
  })

  @ApiOkResponse({
      description: 'Membership plan deleted successfully.',
  })

  @ApiNotFoundResponse({
      description: 'Membership plan not found.',
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.membershipPlansService.remove(id)

    return {
      success: true,
      message: 'Membership plan deleted successfully.',
  };
  }
}
