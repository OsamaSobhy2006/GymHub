import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MembershipStatus } from 'src/common/enums/membership-status.enum';
import { Role } from 'src/common/enums/role.enum';
import { MemberShipPlan } from 'src/membership-plans/entities/membership-plans.entity';
import { Membership } from 'src/membership/entities/membership.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { Reviews } from 'src/reviews/entities/reviews.entity';
import { Session } from 'src/sessions/entities/session.entity';
import { User } from 'src/users/entities/user.entity';
import { Between, Repository } from 'typeorm';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(MemberShipPlan)
        private readonly membershipPlanRepo: Repository<MemberShipPlan>,

        @InjectRepository(Membership)
        private readonly membershipRepo: Repository<Membership>,
    
        @InjectRepository(Session)
        private readonly sessionsRepo: Repository<Session>,

        @InjectRepository(Payment)
        private readonly paymentRepo: Repository<Payment>,

        @InjectRepository(Reviews)
        private readonly reviewsRepo: Repository<Payment>,
    ){}


    async getDashboardStats(){
        const [
            totalUsers,
            totalMembers,
            totalTrainers
        ] = await Promise.all([
            this.userRepo.count(),
            this.userRepo.count({
                where: {role: Role.MEMBER}
            }),
            this.userRepo.count({
                where: { role: Role.TRAINER }
            })
        ])

        const [
            totalMemberships,
            activeMemberships,
            expiredMemberships,
            cancelledMemberships
        ] = await Promise.all([
            this.membershipRepo.count(),
            this.membershipRepo.count({
                where: { status: MembershipStatus.ACTIVE }
            }),
            this.membershipRepo.count({
                where: { status: MembershipStatus.EXPIRED }
            }),
            this.membershipRepo.count({
                where: { status: MembershipStatus.CANCELLED }
            })
        ])

        const totalPlans = await this.membershipPlanRepo.count()

        const totalSessions = await this.sessionsRepo.count()

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tommorow = new Date(today)
        tommorow.setDate(today.getDate() + 1)

        const todaySessions = await this.sessionsRepo.count({
            where: { date: Between(today, tommorow) }
        })

        const totalPayments = await this.paymentRepo.count();

        const totalReviews = await this.reviewsRepo.count();

        const startOfWeek = new Date();

        startOfWeek.setDate(
            startOfWeek.getDate() - startOfWeek.getDay()
        )

        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);

        endOfWeek.setDate(endOfWeek.getDate() + 7);

        const weekSessions =
        await this.sessionsRepo.count({
            where: {
                date: Between(startOfWeek, endOfWeek),
            },
        })

        const startOfMonth = new Date(
                today.getFullYear(),
                today.getMonth(),
                1,
            );

        const endOfMonth = new Date(
                today.getFullYear(),
                today.getMonth() + 1,
                1,
            );

            const monthSessions =
            await this.sessionsRepo.count({
                where: {
                    date: Between(startOfMonth, endOfMonth),
                },
            });

            return {
                users: {
                    total: totalUsers,
                    members: totalMembers,
                    trainers: totalTrainers
                },
                memberships: {
                    total: totalMemberships,
                    active: activeMemberships,
                    expired: expiredMemberships,
                    cancelled: cancelledMemberships
                },
                plans: totalPlans,
                
                sessions: {
                    total: totalSessions,
                    today: todaySessions,
                    thisWeek: weekSessions,
                    thisMonth: monthSessions
                },

                reviews:{
                    total: totalReviews
                },

                payments: {
                    total: totalPayments
                }
            }
    }

    
}
