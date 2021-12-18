import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoService } from 'src/crypto/crypto.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { AccessRefreshTokens } from './dto/access-refresh-tokens.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterLoginDto } from './dto/register-login.dto';
import { Session } from './session.entity';

@Injectable()
export class AuthService {
  private AUTH_SESSION_MAX: number;

  private JWT_ACCESS_EXP: string;
  private JWT_ACCESS_SECRET: string;

  private JWT_REFRESH_EXP: string;
  private JWT_REFRESH_SECRET: string;

  constructor(
    private userService: UserService,
    private cryptoService: CryptoService,
    private jwtService: JwtService,
    configService: ConfigService,

    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {
    this.AUTH_SESSION_MAX = +configService.get<number>('AUTH_SESSION_MAX');

    this.JWT_ACCESS_EXP = configService.get('JWT_ACCESS_EXP');
    this.JWT_ACCESS_SECRET = configService.get('JWT_ACCESS_SECRET');

    this.JWT_REFRESH_EXP = configService.get('JWT_REFRESH_EXP');
    this.JWT_REFRESH_SECRET = configService.get('JWT_REFRESH_SECRET');
  }

  public async validateUser(login: string, password: string) {
    const user = await this.userService.findOneByLogin(login);
    const isValid = await this.cryptoService.scryptVerify(password, user.password);

    if (isValid) return user;
  }

  public async addSession(session: Session) {
    const { user } = session;

    const count = await this.sessionRepository.count({ where: { user } });

    if (count >= this.AUTH_SESSION_MAX) {
      await this.sessionRepository.delete({ user });
    }

    await this.sessionRepository.save(session);
  }

  public async validateRefreshToken(refreshToken: string, userAgent: string, ip: string) {
    try {
      await this.jwtService.verifyAsync(refreshToken, { secret: this.JWT_REFRESH_SECRET });
      return await this.sessionRepository.findOneOrFail({ where: { refreshToken, userAgent, ip } });
    } catch {
      throw new BadRequestException();
    }
  }

  public async createAccessAndRefreshTokens(user: User) {
    const { id, login } = user;
    const payload: JwtPayloadDto = { id, login };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_ACCESS_EXP,
      secret: this.JWT_ACCESS_SECRET,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_REFRESH_EXP,
      secret: this.JWT_REFRESH_SECRET,
    });

    return { accessToken, refreshToken };
  }

  public async refresh({ refreshToken }: RefreshDto, userAgent: string, ip: string) {
    const session = await this.validateRefreshToken(refreshToken, userAgent, ip);

    const { id } = this.jwtService.decode(refreshToken) as JwtPayloadDto;
    const user = await this.userService.findOne(id);
    const refresAndAccessTokens = await this.createAccessAndRefreshTokens(user);

    session.refreshToken = refresAndAccessTokens.refreshToken;
    await this.sessionRepository.save(session);

    return refresAndAccessTokens;
  }

  public async register({ login, password }: RegisterLoginDto) {
    return await this.userService.create({ login, password });
  }

  public async login(user: User, userAgent: string, ip: string) {
    const { refreshToken, accessToken } = await this.createAccessAndRefreshTokens(user);

    const session = this.sessionRepository.create({
      refreshToken,
      ip,
      userAgent,
      user,
    });

    await this.addSession(session);

    return { accessToken, refreshToken };
  }
}
