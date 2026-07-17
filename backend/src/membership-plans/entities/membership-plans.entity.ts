import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('membership-plans')
export class MemberShipPlan {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({unique: true})
    name!: string;

    @Column('text')
    description!: string;

    @Column('decimal')
    price!: number;

    @Column()
    durationInDays!: number;

    @Column({default: true})
    isActive!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}