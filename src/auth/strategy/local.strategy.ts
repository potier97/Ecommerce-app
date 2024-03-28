import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
//SERVICIOS
import { AuthService } from '../services/auth.service';
import { IUserCredential } from 'shared/interfaces/userCredential.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    try {
      const user: IUserCredential = await this.authService.validateUser({
        email,
        password,
      });
      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            message: 'Unauthorized',
            content: false,
          },
          HttpStatus.UNAUTHORIZED
        );
      }
      return user;
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Unauthorized',
          content: false,
        },
        HttpStatus.UNAUTHORIZED
      );
    }
  }
}
