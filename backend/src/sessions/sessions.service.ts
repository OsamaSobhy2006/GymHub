import { MembershipStatus } from 'src/common/enums/membership-status.enum';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Membership } from 'src/membership/entities/membership.entity';
import { CreateSessionDto } from './dtos/create-session.dto';
import { Role } from 'src/common/enums/role.enum';
import { UpdateSessionDto } from './dtos/update-session.dto';
import { SessionStatus } from 'src/common/enums/session-status.enum';

@Injectable()
export class SessionsService {
    constructor(
        @InjectRepository(Session)
        private readonly sessionRepo: Repository<Session>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Membership)
        private readonly membershipRepo: Repository<Membership>
    ){}

    async create(createSessionDto: CreateSessionDto){
        const member = await this.userRepo.findOne({ where: { id: createSessionDto.memberId } })

        if(!member) throw new NotFoundException('Member not found')
        if(member.role !== Role.MEMBER) throw new BadRequestException('Selected user is not a member.')

        const trainer = await this.userRepo.findOne({ where: { id: createSessionDto.trainerId } })

        if(!trainer) throw new NotFoundException('Trainer not found')
        if(trainer.role !== Role.TRAINER) throw new BadRequestException('Selected user is not a trainer')

        const sessionDateTime = new Date(
        `${createSessionDto.date}T${createSessionDto.startTime}:00`
        );

        if (sessionDateTime <= new Date()) {
        throw new BadRequestException(
            'Session must be scheduled for a future date and time.',
        );
        }

        const membership = await this.membershipRepo.findOne({ where: { member: { id: member.id }, status: MembershipStatus.ACTIVE  } })
        
        if(!membership) throw new BadRequestException('Member does not have an active membership.')

        if(membership.endDate < new Date()) throw new BadRequestException('Membership has expired.')

        const trainerSession = await this.sessionRepo.findOne({where: { trainer: { id: trainer.id }, date: createSessionDto.date, startTime: createSessionDto.startTime, status: SessionStatus.SCHEDULED }})
        if(trainerSession) throw new ConflictException('Trainer already has a session at this time.')

        const session = await this.sessionRepo.create({
            title: createSessionDto.title,
            description: createSessionDto.description,
            member,
            trainer,
            date: createSessionDto.date,
            startTime: createSessionDto.startTime,
            endTime: createSessionDto.endTime
        })

        return await this.sessionRepo.save(session)
    }

    async findAll(){
        await this.completeExpiredSessions()
        return await this.sessionRepo.find({order: { createdAt: 'DESC' }})
    }

    async findOne(id: string){
        await this.completeExpiredSessions()
        const session = await this.sessionRepo.findOne({ where: { id } })
        if(!session) throw new NotFoundException('Session not found')

        return session
    }

    async update(id: string, updateSessionDto: UpdateSessionDto){
        const session = await this.findOne(id)

        if (session.status === SessionStatus.CANCELLED) 
            throw new BadRequestException('Cancelled sessions cannot be updated.',);

        const sessionDate = updateSessionDto.date ?? session.date
        const sessionStartTime = updateSessionDto.startTime ?? session.startTime

        const updatedSessionDateTime = new Date(
        `${sessionDate}T${sessionStartTime}:00`
        );

        if (updatedSessionDateTime <= new Date()) {
        throw new BadRequestException(
            'Session must be scheduled for a future date and time.',
        );
        }

        const existingSession = await this.sessionRepo.findOne({
            where: {
                trainer: {
                    id: session.trainer.id,
                },
                date: sessionDate,
                startTime: sessionStartTime,
            },
        });

        if(existingSession && existingSession.id !== session.id)
            throw new ConflictException('Trainer already has a session at this time.')

        Object.assign(session, updateSessionDto)

        return await this.sessionRepo.save(session)
    }

    async remove(id: string) {
        const session = await this.findOne(id)

        if (session.status === SessionStatus.CANCELLED) {
            throw new BadRequestException(
                'Session is already cancelled.'
            );
        }

        if (session.status === SessionStatus.COMPLETED) {
            throw new BadRequestException(
                'Completed sessions cannot be cancelled.'
            );
        }

        session.status = SessionStatus.CANCELLED;

        return await this.sessionRepo.save(session);
    }

    async findMemberSessions(memberId: string) {
        await this.completeExpiredSessions()
    return await this.sessionRepo.find({
        where: {
            member: {
                id: memberId,
            },
        },
        order: {
            date: 'ASC',
            startTime: 'ASC',
        },
    });
    }

    async findTrainerSessions(trainerId: string) {
        await this.completeExpiredSessions()
    return await this.sessionRepo.find({
        where: {
            trainer: {
                id: trainerId,
            },
        },
        order: {
            date: 'ASC',
            startTime: 'ASC',
        },
    });
    }

    private async completeExpiredSessions(): Promise<void> {

    const sessions = await this.sessionRepo.find({
        where: {
            status: SessionStatus.SCHEDULED,
        },
    });

    const now = new Date();

    for (const session of sessions) {

        const sessionEnd = new Date(
            `${session.date}T${session.endTime}:00`
        );

        if (sessionEnd <= now) {

            session.status = SessionStatus.COMPLETED;

            await this.sessionRepo.save(session);

        }

    }

    }
}

    

