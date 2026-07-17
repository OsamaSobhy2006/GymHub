import { Module } from '@nestjs/common';
import { MembershipPlansService } from './membership-plans.service';
import { MembershipPlansController } from './membership-plans.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberShipPlan } from './entities/membership-plans.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MemberShipPlan])],
  controllers: [MembershipPlansController],
  providers: [MembershipPlansService],
})
export class MembershipPlansModule {}
