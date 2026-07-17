import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'Stripe';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { MemberShipPlan } from 'src/membership-plans/entities/membership-plans.entity';
import { User } from 'src/users/entities/user.entity';
import { Membership } from 'src/membership/entities/membership.entity';
import { MembershipStatus } from 'src/common/enums/membership-status.enum';
import { PaymentType } from 'src/common/enums/payment-type.enum';
import { PaymentStatus } from 'src/common/enums/payment-status.enum';
import { Request } from 'express';

@Injectable()
export class PaymentService {
    private readonly stripe!: Stripe;

    constructor(
        private readonly config: ConfigService,

        @InjectRepository(Payment)
        private readonly paymentRepo: Repository<Payment>,

        @InjectRepository(MemberShipPlan)
        private readonly membershipPlanRepo: Repository<MemberShipPlan>,

        @InjectRepository(Membership)
        private readonly membershipRepo: Repository<Membership>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ){
        this.stripe = new Stripe(this.config.getOrThrow<string>('STRIPE_SECRET_KEY'))
    }

    async createMembershipCheckout(memberId: string, planId: string){
        const member = await this.userRepo.findOne({ where: { id: memberId } })
        if(!member) throw new NotFoundException('Member not found')

        const plan = await this.membershipPlanRepo.findOne({ where: { id: planId, isActive: true } })
        if(!plan) throw new NotFoundException('Plan not found')

        const activeMembership = await this.membershipRepo.findOne({
            where: { member: { id: member.id }, status: MembershipStatus.ACTIVE}
        })
        if(activeMembership) throw new BadRequestException('You already have an active membership')

        const checkoutSession = await this.stripe.checkout.sessions.create({
            mode: 'payment',
            success_url: 'http://localhost:4200/payment/success',
            cancel_url: 'http://localhost:4200/payment/cancel',
            line_items: [{
                quantity: 1,
                price_data: {
                    currency: 'egp',
                    unit_amount: Number(plan.price) * 100,

                product_data: {
                    name: plan.name,
                    description: plan.description,
                },
            },
        }],
        metadata: {
            memberId: member.id,
            planId: plan.id,
            type: PaymentType.MEMBERSHIP,
        },
        })

        const payment = this.paymentRepo.create({
            member,
            amount: Number(plan.price),
            status: PaymentStatus.PENDING,
            type: PaymentType.MEMBERSHIP,
            stripeSessionId: checkoutSession.id
        })  

        await this.paymentRepo.save(payment)

        return {
            checkoutUrl: checkoutSession.url,
            sessionId: checkoutSession.id
        }

    }

    async handleWebhook(request: Request, signature: string) {
        let event: Stripe.Event

        try {
            event = this.stripe.webhooks.constructEvent(
                request['rawBody'],
                signature,
                this.config.getOrThrow<string>('STRIPE_WEBHOOK_SECRET')
            )
        } catch (error) {
            throw new BadRequestException('Invalid Stripe Signature')
        }

        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session
                const payment = await this.paymentRepo.findOne({ where: { stripeSessionId: session.id } })
                if(!payment) throw new NotFoundException('Payment not found')
                if(payment.status === PaymentStatus.PAID) return {received: true}
                payment.status = PaymentStatus.PAID
                payment.paidAt = new Date()
                payment.stripePaymentIntentId = String(session.payment_intent)
                await this.paymentRepo.save(payment)

                if(session.metadata?.type === PaymentType.MEMBERSHIP){
                    const member = await this.userRepo.findOne({ where: {id: session.metadata.memberId} })
                    const plan = await this.membershipPlanRepo.findOne({ where: {id: session.metadata.planId} })
                    if(!member || !plan) throw new NotFoundException("Member or Plan not found")
                    
                    const endDate = new Date()
                    endDate.setDate(endDate.getDate() + plan.durationInDays)

                    const membership = this.membershipRepo.create({
                        member,
                        membershipPlan: plan,
                        startDate: new Date(),
                        endDate,
                        status: MembershipStatus.ACTIVE
                    })

                    await this.membershipRepo.save(membership)
                    payment.membership = membership
                    await this.paymentRepo.save(payment)
                }
                break;
            }
            default:
                console.log(`Unhandled event: ${event.type}`)
        }

        return {
            received: true
        }
    }

    async findAll() {
        return await this.paymentRepo.find({
            relations: {
            member: true,
            membership: {
                membershipPlan: true
            }
            },
            order: {
            createdAt: 'DESC'
            }
        });
    }

    async findOne(id: string) {
        const payment = await this.paymentRepo.findOne({
            where: {
            id
            },
            relations: {
            member: true,
            membership: {
                membershipPlan: true
            }
            }
        });

        if (!payment) {
            throw new NotFoundException('Payment not found.');
        }

        return payment;
    }
}
