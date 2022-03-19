import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from './strategy';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends Strategy {
  constructor(private authService: AuthService) {
    super('local');
  }

  private getLoginAndPassword(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const { body } = req;
    const { login, password } = body as Record<'login' | 'password', string | null>;

    if (!login || !password) {
      throw new UnauthorizedException();
    }

    return { login, password };
  }

  public async validate(context: ExecutionContext) {
    const { login, password } = this.getLoginAndPassword(context);
    const user = await this.authService.validateUser(login, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
