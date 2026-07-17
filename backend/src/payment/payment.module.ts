import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { MemberShipPlan } from 'src/membership-plans/entities/membership-plans.entity';
import { User } from 'src/users/entities/user.entity';
import { Membership } from 'src/membership/entities/membership.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, MemberShipPlan, User, Membership])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
