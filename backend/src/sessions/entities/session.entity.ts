import { SessionStatus } from "src/common/enums/session-status.enum";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('sessions')
export class Session {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
    
    @Column({ length: 100 })
    title!: string;

    @Column({ type: 'text' })
    description!: string;

    @Column({ type: 'date' })
    date!: Date;


    @Column()
    startTime!: string;

    @Column()
    endTime!: string;

    @Column({ type: 'enum', enum: SessionStatus, default: SessionStatus.SCHEDULED })
    status!: SessionStatus;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => User, {
        eager: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'memberId' })
    member!: User;

    @ManyToOne(() => User, {
        eager: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'trainerId' })
    trainer!: User;
}