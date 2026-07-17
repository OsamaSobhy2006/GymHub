import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { CreateMembershipDto } from './dtos/create-membership.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/enums/role.enum';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Memberships')
@ApiBearerAuth()
@Controller('membership')
export class MembershipController {
    constructor(private readonly membershipService: MembershipService) {}

    @ApiOperation({
    summary: 'Create membership',
    description: 'Create a membership for a member.',
    })

    @ApiCreatedResponse({
    description: 'Membership created successfully.',
    })

    @ApiBadRequestResponse({
    description: 'Validation failed.',
    })

    @ApiNotFoundResponse({
    description: 'Member or membership plan not found.',
    })

    @ApiForbiddenResponse({
    description: 'Only admins can create memberships.',
    })
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    async create(@Body() dto: CreateMembershipDto) {
        const membership = await this.membershipService.create(dto)
        
        return {
        success: true,
        message: "Membership created successfully.",
        data: membership
        }
    }

    @ApiOperation({
    summary: 'Get all memberships',
    })

    @ApiOkResponse({
    description: 'Memberships retrieved successfully.',
    })
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    async findAll() {
        const membership = await this.membershipService.findAll()

        return {
            success: true,
            message: "Memberships retrieved successfully.",
            data: membership
        }
    }

    @ApiOperation({
        summary: 'Get active memberships',
    })

    @ApiOkResponse({
        description: 'Active memberships retrieved successfully.',
    })
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get('active')
    async getActive(){
        const memberships = await this.membershipService.getActivateMemberships()

        return {
            success: true,
            message: "Active memberships retrieved successfully.",
            data: memberships
        }
    }

    @ApiOperation({
        summary: 'Get expired memberships',
    })

    @ApiOkResponse({
        description: 'Expired memberships retrieved successfully.',
    })
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get('expired')
    async getExpired(){
        const memberships = await this.membershipService.getExpiredMemberships()

        return {
            success: true,
            message: "Expired memberships retrieved successfully.",
            data: memberships
        }
    }
    
    @ApiOperation({
        summary: 'Get member membership history',
    })

    @ApiOkResponse({
        description: 'Membership history retrieved successfully.',
    })

    @ApiNotFoundResponse({
        description: 'Member not found.',
    })
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.MEMBER)
    @Get('me')
    async getMemberMembershipHistory(@Req() req: Request) {
        const memberships = await this.membershipService.getMemberMembershipHistory(
        req['user'].sub,
        );

        return {
            success: true,
            message: 'Membership history retrieved successfully.',
            data: memberships,
        };
    }

    @ApiOperation({
    summary: 'Get membership by id',
    })

    @ApiOkResponse({
    description: 'Membership retrieved successfully.',
    })

    @ApiNotFoundResponse({
    description: 'Membership not found.',
    })
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get(':id')
    async fineOne(@Param('id', ParseUUIDPipe) id: string) {
        const membership = await this.membershipService.findOne(id)

        return {
            success: true,
            message: "Memberships retrieved successfully.",
            data: membership
        }
    }

    @ApiOperation({
    summary: 'Delete membership',
    })

    @ApiOkResponse({
    description: 'Membership deleted successfully.',
    })

    @ApiNotFoundResponse({
    description: 'Membership not found.',
    })
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
        const membership = await this.membershipService.remove(id)

        return {
            success: true,
            message: "Memberships cancelled successfully.",
            data: membership
        }
    }

    @ApiOperation({
        summary: 'Renew membership',
    })

    @ApiOkResponse({
        description: 'Membership renewed successfully.',
    })

    @ApiNotFoundResponse({
        description: 'Membership not found.',
    })

    @ApiBadRequestResponse({
        description: 'Membership cannot be renewed.',
    })
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post(':id/renew')
    async renew(@Param('id', ParseUUIDPipe) id: string) {
        const membership = await this.membershipService.renewMembership(id)

        return {
            success: true,
            message: "Membership renewed successfully.",
            data: membership
        }
    }
}
