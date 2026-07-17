import { MembershipStatus } from 'src/common/enums/membership-status.enum';
import { MemberShipPlan } from 'src/membership-plans/entities/membership-plans.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('membership')
export class Membership {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  startDate!: Date;

  @Column()
  endDate!: Date;

  @Column({
    type: 'enum',
    enum: MembershipStatus,
    default: MembershipStatus.ACTIVE,
  })
  status!: MembershipStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.memberships, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'memberId' })
  member!: User;

  @ManyToOne(() => MemberShipPlan, {
    eager: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'membershipPlanId' })
  membershipPlan!: MemberShipPlan;
}
