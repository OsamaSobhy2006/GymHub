import { Controller, Get, Headers, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/enums/role.enum';
import type { Request } from 'express';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiExcludeEndpoint, ApiForbiddenResponse, ApiNotFoundResponse, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Get all payments'
  })
  @ApiResponse({
    status: 200,
    description: 'Payments retrieved successfully.'
  })
  async findAll() {
    return {
      success: true,
      message: 'Payments retrieved successfully.',
      data: await this.paymentService.findAll()
    };
  }

  @ApiBearerAuth()

  @ApiOperation({
    summary: 'Create Stripe checkout session',
    description: 'Creates a Stripe Checkout session for purchasing a membership.',
  })

  @ApiCreatedResponse({
    description: 'Checkout session created successfully.',
  })

  @ApiNotFoundResponse({
    description: 'Member or membership plan not found.',
  })

  @ApiBadRequestResponse({
    description: 'Member already has an active membership.',
  })

  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })

  @ApiForbiddenResponse({
    description: 'Only members can purchase memberships.',
  })
  @Post('membership/:planId')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.MEMBER)
  createMembershiCheckout(@Req() req: Request, @Param('planId', ParseUUIDPipe) planId: string) {
    return this.paymentService.createMembershipCheckout(req['user'].sub, planId)
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Get payment by id'
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Payment id'
  })
  @ApiResponse({
    status: 200,
    description: 'Payment retrieved successfully.'
  })
  @ApiResponse({
    status: 404,
    description: 'Payment not found.'
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return {
      success: true,
      message: 'Payment retrieved successfully.',
      data: await this.paymentService.findOne(id)
    };
  }

  @ApiExcludeEndpoint()
  @Post('webhook')
  async webhook(@Req() req: Request, @Headers('stripe-signature') signature: string) {
    return this.paymentService.handleWebhook(
      req,
      signature,
    );
  }

}
