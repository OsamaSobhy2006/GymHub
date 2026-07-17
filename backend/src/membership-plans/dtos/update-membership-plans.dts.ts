import { PartialType } from '@nestjs/swagger';
import { CreateMemberShipPlanDto } from './create-membership-plans.dto';

export class UpdateMembershipPlanDto extends PartialType(
  CreateMemberShipPlanDto,
) {}
