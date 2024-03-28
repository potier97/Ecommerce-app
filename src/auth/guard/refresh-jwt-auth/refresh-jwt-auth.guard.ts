import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import envConfig from 'src/config/env-config';

@Injectable()
export class RefreshJwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject(envConfig.KEY) private configService: ConfigType<typeof envConfig>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException({
          message: 'Unauthorized access',
          error: true,
          status: 401,
        });
      }
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.jwtRefreshSecret,
      });
      request['user'] = payload;
      return true;
    } catch {
      return false;
    }
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw new UnauthorizedException({
        message: 'Unauthorized access',
        error: true,
        status: 401,
      });
    }
    return user;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const values = request.headers['authorization'].split(/\s+/) ?? [];
    return values[0] === 'Bearer' ? values[1] : undefined;
  }
}
