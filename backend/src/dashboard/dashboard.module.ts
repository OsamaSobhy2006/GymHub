import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Membership } from 'src/membership/entities/membership.entity';
import { MemberShipPlan } from 'src/membership-plans/entities/membership-plans.entity';
import { Session } from 'src/sessions/entities/session.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { Reviews } from 'src/reviews/entities/reviews.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Membership, MemberShipPlan, Session, Payment, Reviews])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
