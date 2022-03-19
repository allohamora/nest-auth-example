import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from '../auth.service';
import { Strategy } from './strategy';

@Injectable()
export class JwtStrategy extends Strategy {
  constructor(private userService: UserService, private authService: AuthService) {
    super('jwt');
  }

  private getAccessToken(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const { headers } = req;
    const { authorization } = headers as { authorization?: string };

    if (!authorization) {
      throw new UnauthorizedException();
    }

    const accessToken = authorization.replace('Bearer ', '').trim();

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    return { accessToken };
  }

  public async validate(context: ExecutionContext) {
    const { accessToken } = this.getAccessToken(context);
    const { id } = await this.authService.validateAccessToken(accessToken);

    return this.userService.findOne(id);
  }
}
