import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
//SERVICES
import { Configuration } from 'config/config.keys';
import { IUserJwt } from 'shared/interfaces/userJwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(Configuration.JWT_SECRET),
    });
  }

  async validate(payload: IUserJwt) {
    try {
      return { id: payload.sub, name: payload.name, email: payload.email };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Credenciales Incorrectas',
          content: false,
        },
        HttpStatus.UNAUTHORIZED
      );
    }
  }
}
