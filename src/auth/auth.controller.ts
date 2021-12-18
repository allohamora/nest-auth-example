import { Body, Controller, Get, HttpCode, HttpStatus, Ip, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';
import { ApiException } from 'src/utils/api-exception.decorator';
import { UserAgent } from 'src/utils/user-agent.decorator';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { AccessRefreshTokens } from './dto/access-refresh-tokens.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterLoginDto } from './dto/register-login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOkResponse({ type: AccessRefreshTokens })
  @ApiException({ statusCode: HttpStatus.UNAUTHORIZED })
  @ApiBody({ type: RegisterLoginDto })
  @UseGuards(AuthGuard('local'))
  @HttpCode(200)
  @Post('login')
  public async login(
    @CurrentUser() user: User,
    @UserAgent() userAgent: string,
    @Ip() ip: string,
  ): Promise<AccessRefreshTokens> {
    return this.authService.login(user, userAgent, ip);
  }

  @ApiException({ statusCode: HttpStatus.BAD_REQUEST })
  @ApiCreatedResponse({ description: 'user created' })
  @Post('register')
  public async register(@Body() registerDto: RegisterLoginDto): Promise<void> {
    return await this.authService.register(registerDto);
  }

  @ApiException({ statusCode: HttpStatus.BAD_REQUEST })
  @ApiOkResponse({ type: AccessRefreshTokens })
  @Post('refresh')
  @HttpCode(200)
  public async refresh(
    @Body() refreshDto: RefreshDto,
    @UserAgent() userAgent: string,
    @Ip() ip: string,
  ): Promise<AccessRefreshTokens> {
    return await this.authService.refresh(refreshDto, userAgent, ip);
  }

  @ApiOkResponse({ type: User })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('test')
  public async test(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
