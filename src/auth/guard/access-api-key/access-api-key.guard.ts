import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../../decorator/public.decorator';
//CONFIG
import envConfig from 'config/env-config';

//Importados

@Injectable()
export class AccessApiKeyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(envConfig.KEY) private configService: ConfigType<typeof envConfig>
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    //VALIDMOS PRIMERO SI EL ENDPOINT ES PUBLICO
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.header('x-api-key');
    const isAuth = authHeader === this.configService.apiKey;
    if (!isAuth) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Acesso No autorizado',
        },
        HttpStatus.UNAUTHORIZED
      );
    }
    return isAuth;
  }
}
