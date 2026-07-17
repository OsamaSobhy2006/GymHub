import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new member.',
  })

  @ApiResponse({
    status: 201,
    description: 'User registered successfully.',
  })

  @ApiResponse({
    status: 400,
    description: 'Validation failed.',
  })

  @ApiResponse({
    status: 409,
    description: 'Email already exists.',
  })

  @Post('register')
  async register(@Body() userData: RegisterDto) {
    return await this.authService.register(userData)
  }

  @ApiOperation({
    summary: 'Login',
    description: 'Authenticate user and return JWT token.',
  })

  @ApiResponse({
    status: 200,
    description: 'Login successful.',
  })

  @ApiResponse({
    status: 401,
    description: 'Invalid email or password.',
  })

  @Post('login')
  async login(@Body() userData: LoginDto){
    return await this.authService.login(userData)
  }

  @ApiBearerAuth()

  @ApiOperation({
    summary: 'Get current user profile',
  })

  @ApiResponse({
    status: 200,
    description: 'Current user returned successfully.',
  })

  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @Get('me')
  @UseGuards(JwtGuard)
  getCurrentUser(@CurrentUser() user: JwtPayload){
    return this.authService.getMe(user.sub)
  }
}
