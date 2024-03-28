import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../decorator/public.decorator';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
      if (isPublic) {
        return true;
      }
      return super.canActivate(context);
    } catch {
      return false;
    }
  }
}
