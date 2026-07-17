import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { User } from 'src/users/entities/user.entity';
import { Membership } from 'src/membership/entities/membership.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session, User, Membership]), ],
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}
