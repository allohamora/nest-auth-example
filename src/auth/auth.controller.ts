import { Body, Controller, Get, HttpCode, HttpStatus, Ip, Post } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';
import { ApiException } from 'src/utils/api-exception.decorator';
import { UserAgent } from 'src/utils/user-agent.decorator';
import { Auth } from './auth.decorator';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { AccessRefreshTokens } from './dto/access-refresh-tokens.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterLoginDto } from './dto/register-login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Auth({ strategy: 'local' })
  @ApiOkResponse({ type: AccessRefreshTokens })
  @ApiBody({ type: RegisterLoginDto })
  @HttpCode(200)
  public async login(
    @CurrentUser() user: User,
    @UserAgent() userAgent: string,
    @Ip() ip: string,
  ): Promise<AccessRefreshTokens> {
    return this.authService.login(user, userAgent, ip);
  }

  @Post('register')
  @ApiException({ statusCode: HttpStatus.BAD_REQUEST })
  @ApiCreatedResponse({ type: User })
  public async register(@Body() registerDto: RegisterLoginDto): Promise<User> {
    return await this.authService.register(registerDto);
  }

  @Post('refresh')
  @ApiException({ statusCode: HttpStatus.BAD_REQUEST })
  @ApiOkResponse({ type: AccessRefreshTokens })
  @HttpCode(200)
  public async refresh(
    @Body() refreshDto: RefreshDto,
    @UserAgent() userAgent: string,
    @Ip() ip: string,
  ): Promise<AccessRefreshTokens> {
    return await this.authService.refresh(refreshDto, userAgent, ip);
  }

  @Auth()
  @Get('test')
  @ApiOkResponse({ type: User })
  public async test(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
