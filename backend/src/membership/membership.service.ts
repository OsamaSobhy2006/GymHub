import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { MemberShipPlan } from 'src/membership-plans/entities/membership-plans.entity';
import { CreateMembershipDto } from './dtos/create-membership.dto';
import { Role } from 'src/common/enums/role.enum';
import { MembershipStatus } from 'src/common/enums/membership-status.enum';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepo: Repository<Membership>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(MemberShipPlan)
    private readonly membershipPlanRepo: Repository<MemberShipPlan>,
  ) {}

  async create(createMembershipDto: CreateMembershipDto) {
    const member = await this.userRepo.findOne({
      where: { id: createMembershipDto.memberId },
    });
    if (!member) throw new NotFoundException('Member not found');

    if (member.role !== Role.MEMBER)
      throw new BadRequestException('Selected User is not a member');

    const membershipPlan = await this.membershipPlanRepo.findOne({
      where: { id: createMembershipDto.membershipPlanId },
    });
    if (!membershipPlan)
      throw new NotFoundException('Membership plan not found');

    if (!membershipPlan.isActive)
      throw new BadRequestException('Membership Plan is InActive');

    const activeMembership = await this.membershipRepo.findOne({
      where: {
        member: { id: createMembershipDto.memberId },
        status: MembershipStatus.ACTIVE,
      },
    });
    if (activeMembership)
      throw new ConflictException('Member already has as active membership');

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + membershipPlan.durationInDays);

    const membership = this.membershipRepo.create({
      member,
      membershipPlan,
      startDate,
      endDate,
      status: MembershipStatus.ACTIVE,
    });

    return await this.membershipRepo.save(membership);
  }

  async findAll() {
    return await this.membershipRepo.find();
  }

  async findOne(id: string) {
    const membership = await this.membershipRepo.findOne({ where: { id } });

    if (!membership) throw new NotFoundException('Membership not found');

    return membership;
  }

  async remove(id: string) {
    const membership = await this.findOne(id);

    membership.status = MembershipStatus.CANCELLED;

    return await this.membershipRepo.save(membership);
  }

  async getMemberMembershipHistory(memberId: string) {
    const member = await this.userRepo.findOne({
      where: {
        id: memberId,
      },
    });

    if (!member) throw new NotFoundException('Member not found');

    const memberships = await this.membershipRepo.find({
      where: { member: { id: memberId } },
      order: { createdAt: 'DESC' },
    });
    if (memberships.length === 0)
      throw new NotFoundException(
        'No memberships history found for this member',
      );

    return memberships;
  }

  async renewMembership(id: string) {
    const membership = await this.findOne(id);

    if (membership.status === MembershipStatus.CANCELLED)
      throw new BadRequestException('Cancelled membership cannot be renewed.');

    const duration = membership.membershipPlan.durationInDays;
    const today = new Date();

    if (membership.endDate < today) {
      membership.startDate = today;
      membership.endDate = new Date(today);

      membership.endDate.setDate(membership.endDate.getDate() + duration);
    } else {
      membership.endDate.setDate(membership.endDate.getDate() + duration);
    }

    membership.status = MembershipStatus.ACTIVE;

    return await this.membershipRepo.save(membership);
  }

  async getActivateMemberships() {
    return await this.membershipRepo.findOne({
      where: { status: MembershipStatus.ACTIVE },
      order: { createdAt: 'DESC' },
    });
  }

  async getExpiredMemberships() {
    return await this.membershipRepo.findOne({
      where: { status: MembershipStatus.EXPIRED },
      order: { createdAt: 'DESC' },
    });
  }
}
