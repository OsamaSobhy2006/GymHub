import { Exclude } from "class-transformer";
import { Role } from "src/common/enums/role.enum";
import { UserStatus } from "src/common/enums/user-status.enum";
import { Membership } from "src/membership/entities/membership.entity";
import { Payment } from "src/payment/entities/payment.entity";
import { Reviews } from "src/reviews/entities/reviews.entity";
import { Session } from "src/sessions/entities/session.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ length: 100 })
    fullname!: string;

    @Column({ unique: true, length: 255 })
    email!: string;

    @Column()
    @Exclude()
    password!: string;

    @Column({ default: Role.MEMBER, type: 'enum', enum: Role })
    role!: Role;

    @Column({ default: UserStatus.ACTIVE, type: 'enum', enum: UserStatus })
    status!: UserStatus;

    @Column({ default: '/uploads/profile/wattblicker-avatar-7964945_1920.png' })
    profileImage!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => Membership, (membership) => membership.member)
    memberships!: Membership[];

    @OneToMany(() => Session, (session) => session.member)
    memberSessions!: Session[];

    @OneToMany(() => Session, (session) => session.trainer)
    trainerSessions!: Session[];

    @OneToMany(() => Payment, (payment) => payment.member)
    payments!: Payment[];

    @OneToMany(() => Reviews, (review) => review.member)
    givenReviews!: Reviews[];

    @OneToMany(() => Reviews, (review) => review.trainer)
    receivedReviews!: Reviews[];
}