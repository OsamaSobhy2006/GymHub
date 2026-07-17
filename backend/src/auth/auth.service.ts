import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enums/role.enum';
import { UserStatus } from 'src/common/enums/user-status.enum';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async register(registerDto: RegisterDto){
        const { fullname, email, password } = registerDto

        const existingUser = await this.usersService.findByEmail(email)

        if(existingUser) throw new BadRequestException('Email Already Exists')


        const user = await this.usersService.create({
            fullname,
            email,
            password, 
            role: Role.MEMBER
        })

        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
            fullname: user.fullname,
            role: user.role,
        })

        const { password: _, ...userWithoutPassword } = user;

        return {
            message: 'Account Created Successfully',
            accessToken,
            user: userWithoutPassword
        }
    }

    async login(loginDto: LoginDto){
        const user = await this.usersService.findByEmail(loginDto.email)

        if(!user) throw new UnauthorizedException('Invalid Email or Password')

        if(user.status === UserStatus.INACTIVE)
            throw new ForbiddenException('Your account is inactive. Please contact the administrator.')

        const isMatch = await bcrypt.compare(loginDto.password, user.password )

        if(!isMatch) throw new UnauthorizedException('Invalid Email or Password')

        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
            fullname: user.fullname,
            role: user.role
        })

        const { password, ...userWithoutPassword } = user;

        return {
            message: 'Login Successful',
            accessToken,
            user: userWithoutPassword,
        };
    }

    async getMe(userId: string) {
        const user = await this.usersService.findOne({ where: {id: userId} })

        if(!user) throw new NotFoundException("User not found")

        const { password, ...userWithoutPassword} = user;

        return userWithoutPassword;
    }

}
