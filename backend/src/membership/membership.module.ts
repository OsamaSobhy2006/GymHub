import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity';
import { User } from 'src/users/entities/user.entity';
import { MemberShipPlan } from 'src/membership-plans/entities/membership-plans.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Membership, User, MemberShipPlan])],
  controllers: [MembershipController],
  providers: [MembershipService],
})
export class MembershipModule {}
