import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/enums/role.enum';
import { ApiBearerAuth, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({
    summary: 'Get dashboard statistics',
    description:
      'Returns the main statistics displayed in the admin dashboard.',
  })

  @ApiOkResponse({
    description: 'Dashboard statistics retrieved successfully.',
  })

  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })

  @ApiForbiddenResponse({
    description: 'Only admins can access dashboard statistics.',
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('stats')
  async getDashboardStats(){
    return await this.dashboardService.getDashboardStats()
  }
}
