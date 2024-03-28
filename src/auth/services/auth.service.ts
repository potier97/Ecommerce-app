import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
//DTO
import { AuthDto } from '../dto/auth.dto';
import { SignUpDto } from '../dto/signup.dto';
import { CreateUserDto } from 'modules/user/dto/create-user.dto';
//SHARED
import { comparePassword, encryptPassword } from 'shared/util/encrypt';
import { IUserCredential } from 'shared/interfaces/userCredential.interface';
//INTERFACES
import { UserType } from 'shared/interfaces/userType.enu';
import { IUserJwt } from 'shared/interfaces/userJwt.interface';
//CONFIG
import envConfig from 'config/env-config';
//services
import { UserService } from 'modules/user/services/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(envConfig.KEY) private configService: ConfigType<typeof envConfig>
  ) {}

  public async signUp(user: SignUpDto): Promise<any> {
    const existingUser = await this.userService.findUserByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException({
        message: 'El correo ya está en uso',
        error: true,
        status: 400,
      });
    }
    if (user.password !== user.repeatPassword) {
      throw new BadRequestException({
        message: 'Las contraseñas no coinciden',
        error: true,
        status: 400,
      });
    }
    const pwd = await encryptPassword(user.password);
    const newUser: CreateUserDto = {
      email: user.email,
      firstName: user.firstName,
      repeatPassword: user.repeatPassword,
      password: pwd,
      genre: user.genre,
      lastName: user.lastNasme,
      role: UserType.CLIENT,
      familyName: '',
      secondName: '',
    };
    const result = await this.userService.create(newUser);

    this.logger.log(`Create a new user: ${result['id']}`);
    return {
      id: result['id'],
      username: `${result.firstName} ${result.lastName}`,
      email: result.email,
      role: result.role,
    };
  }

  public async validateUser(user: AuthDto): Promise<IUserCredential> {
    const { email } = user;
    const userExist = await this.userService.findUserByEmail(email);
    if (!userExist) {
      throw new BadRequestException({
        message: 'Bad credentials',
        error: true,
        status: 400,
      });
    }
    const checkPwd = await comparePassword(user.password, userExist.password);
    if (!checkPwd) {
      throw new BadRequestException({
        message: 'Bad credentials',
        error: true,
        status: 400,
      });
    }
    const userName =
      `${userExist.firstName} ${userExist.secondName} ${userExist.lastName} ${userExist.familyName}`
        .trim()
        .replace(/\s{2,}/g, ' ');
    const payload = {
      name: userName,
      email: userExist.email,
      sub: userExist['id'],
    };
    const userToken = await this.generateJwt(payload);
    const refreshToken = await this.generateRefreshJwt(payload);
    return {
      token: userToken,
      refreshToken: refreshToken,
      user: {
        id: userExist['id'],
        username: userName,
        email: userExist.email,
        role: userExist.role,
        genre: userExist.genre,
      },
    };
  }

  async generateToken(email: string): Promise<IUserCredential> {
    const userExist = await this.userService.findUserByEmail(email);
    const userName =
      `${userExist.firstName} ${userExist.secondName} ${userExist.lastName} ${userExist.familyName}`
        .trim()
        .replace(/\s{2,}/g, ' ');
    const payload = {
      name: userName,
      email: userExist.email,
      sub: userExist['id'],
    };
    //TODO: INVALIDAR LOS TOKENS ANTERIORES
    const userToken = await this.generateJwt(payload);
    const refreshToken = await this.generateRefreshJwt(payload);
    return {
      token: userToken,
      refreshToken: refreshToken,
      user: {
        id: userExist['id'],
        username: userName,
        email: userExist.email,
        role: userExist.role,
        genre: userExist.genre,
      },
    };
  }

  async generateJwt(payload: IUserJwt): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  async generateRefreshJwt(payload: IUserJwt): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.jwtRefreshExpirationTime,
      algorithm: 'HS512',
      //privateKey: this.configService.jwtRefreshKey,
      secret: this.configService.jwtRefreshSecret,
    });
  }

  public async getProfile(email: string): Promise<any> {
    const userExist = await this.userService.findUserByEmail(email);
    if (!userExist) {
      throw new BadRequestException({
        message: 'Bad credentials',
        error: true,
        status: 400,
      });
    }
    this.logger.log(`Get profile: ${userExist['id']}`);
    const userName =
      `${userExist.firstName} ${userExist.secondName} ${userExist.lastName} ${userExist.familyName}`
        .trim()
        .replace(/\s{2,}/g, ' ');
    return {
      id: userExist['id'],
      username: userName,
      firstName: userExist.firstName,
      secondName: userExist.secondName,
      lastName: userExist.lastName,
      familyName: userExist.familyName,
      email: userExist.email,
      role: userExist.role,
      genre: userExist.genre,
    };
  }
}
