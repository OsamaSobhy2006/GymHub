import { UpdateMembershipPlanDto } from './dtos/update-membership-plans.dts';
import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { MemberShipPlan } from './entities/membership-plans.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMemberShipPlanDto } from './dtos/create-membership-plans.dto';

@Injectable()
export class MembershipPlansService {
    constructor(
        @InjectRepository(MemberShipPlan)
        private readonly membershipPlanRepo: Repository<MemberShipPlan>,
    ) {}

    async create(createMemberShipPlan: CreateMemberShipPlanDto) {
        const existingPlan = await this.membershipPlanRepo.findOne({
        where: { name: createMemberShipPlan.name },
        });

        if (existingPlan)
        throw new ConflictException('Membership plan already exist');

        const membershipPlan = this.membershipPlanRepo.create(createMemberShipPlan);

        return await this.membershipPlanRepo.save(membershipPlan);
    }

    async findAll() {
        return await this.membershipPlanRepo.find();
    }

    async findOne(id: string) {
        const membershipPlan = await this.membershipPlanRepo.findOne({
        where: { id },
        });

        if (!membershipPlan)
        throw new NotFoundException('Membeship Plan not found');

        return membershipPlan;
    }

    async update(
    id: string,
    updateMembershipPlanDto: UpdateMembershipPlanDto,
    ) {
    const membershipPlan = await this.findOne(id);

    if (
        updateMembershipPlanDto.name &&
        updateMembershipPlanDto.name !== membershipPlan.name
    ) {
        const existingPlan =
        await this.membershipPlanRepo.findOne({
            where: {
            name: updateMembershipPlanDto.name,
            },
        });

        if (existingPlan) {
        throw new ConflictException('Membership plan already exists');
        }
    }

    Object.assign(membershipPlan, updateMembershipPlanDto);

    return await this.membershipPlanRepo.save(membershipPlan);
    }

    async remove(id: string) {
        const membershipPlan = await this.findOne(id);

        membershipPlan.isActive = false;

        return await this.membershipPlanRepo.save(membershipPlan);
    }
}
