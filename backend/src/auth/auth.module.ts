import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { SecurityModule } from 'src/security/security.module';

@Module({
  imports: [
    UsersModule, 
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
