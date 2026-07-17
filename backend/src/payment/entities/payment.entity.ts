import { PaymentStatus } from "src/common/enums/payment-status.enum";
import { PaymentType } from "src/common/enums/payment-type.enum";
import { Membership } from "src/membership/entities/membership.entity";
import { Session } from "src/sessions/entities/session.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('payments')
export class Payment{
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'decimal' })
    amount!: number;

    @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
    status!: PaymentStatus;

    @Column({ type: 'enum', enum: PaymentType,})
    type!: PaymentType;

    @Column({ nullable: true })
    stripeSessionId?: string;

    @Column({ nullable: true })
    stripePaymentIntentId?: string;

    @Column({ type: 'timestamp', nullable: true })
    paidAt?: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => User, (user) => user.payments, {
    eager: true,
    onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'memberId' })
    member!: User;

    @OneToOne(() => Membership, {
    nullable: true,
    eager: true,
    onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'membershipId' })
    membership?: Membership;

    @OneToOne(() => Session, {
    nullable: true,
    eager: true,
    onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'sessionId' })
    session?: Session;
    
}