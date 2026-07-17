import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('reviews')
export class Reviews {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    rating!: number;

    @Column()
    comment!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatdAt!: Date;

    @ManyToOne(() => User, (user) => user.givenReviews, {
        eager: true,
        onDelete: 'CASCADE'
    })

    @JoinColumn({ name: 'memberId' })
    member!: User;

    @ManyToOne(() => User, (user) => user.receivedReviews, {
    eager: true,
    onDelete: 'CASCADE',
    })
    
    @JoinColumn({ name: 'trainerId' })
    trainer!: User;

}