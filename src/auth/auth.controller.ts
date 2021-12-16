import { Body, Controller, Get, Ip, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/user.entity';
import { UserAgent } from 'src/utils/user-agent.decorator';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterLoginDto } from './dto/register-login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  public async login(@CurrentUser() user: User, @UserAgent() userAgent: string, @Ip() ip: string) {
    return this.authService.login(user, userAgent, ip);
  }

  @Post('register')
  public async register(@Body() registerDto: RegisterLoginDto) {
    return await this.authService.register(registerDto);
  }

  @Post('refresh')
  public async refresh(@Body() refreshDto: RefreshDto, @UserAgent() userAgent: string, @Ip() ip: string) {
    return await this.authService.refresh(refreshDto, userAgent, ip);
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  public async test(@CurrentUser() user: User) {
    return user;
  }
}
