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
import { emailWhiteList } from 'auth/constants/whiteList';
import { EmailService } from 'modules/email/services/email.service';
import { generateOtp } from 'shared/util/generateOtp';
import { ResetPwdDto } from 'auth/dto/resetPwd.dto';
import { UpdateUserDto } from 'modules/user/dto/update-user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    @Inject(envConfig.KEY) private configService: ConfigType<typeof envConfig>
  ) {}

  public async signUp(user: SignUpDto): Promise<any> {
    //ORIGIN DOMAIN VALIDATION
    const isValidMail = this.validateEmail(user.email);
    if (!isValidMail) {
      throw new BadRequestException({
        message: 'Correo no permitido',
        error: true,
        status: 400,
      });
    }
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
      phone: user.phone,
      lastName: user.lastNasme,
      role: UserType.CLIENT,
      familyName: '',
      secondName: '',
    };
    const result = await this.userService.create(newUser);

    this.logger.log(`Create a new user: ${result['id']}`);
    //SEND EMAIL
    const message = `Hola ${result.firstName} ${result.lastName}, bienvenido a la plataforma, deberás confirmar tu correo electrónico para poder acceder a la plataforma.`;
    await this.sendMail(result.email, message, 'Bienvenido');
    return {
      id: result['id'],
      username: `${result.firstName} ${result.lastName}`,
      email: result.email,
      role: result.role,
    };
  }

  private validateEmail(email: string): boolean {
    const emailParts = email.split('@');
    const domain = emailParts[emailParts.length - 1];
    return emailWhiteList.includes(domain);
  }

  /**
   * Send an email to the user
   * @param email - Email to send
   * @param message - Message to send
   * @param subject - Subject of the email
   */
  private async sendMail(
    email: string,
    message: string,
    subject: string
  ): Promise<void> {
    await this.emailService.sendEmail({
      email: email,
      message: message,
      subject: subject,
    });
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

  async forgotPassword(email: string): Promise<string> {
    try {
      const userExist = await this.userService.findUserByEmail(email);
      if (!userExist) {
        throw new BadRequestException({
          message: 'User not found',
          error: true,
          status: 400,
        });
      }
      const token = generateOtp(3);
      //SEND MAIL NOTIFICATION WITH TOKEN
      const message = `Hola ${userExist.firstName}, hemos recibido una solicitud para cambiar tu contraseña, tu token es: ${token}`;
      await this.sendMail(email, message, 'Cambio de contraseña');
      return `Email sent to ${email}`;
    } catch (error) {
      this.logger.error('User cannot chang e the password');
      throw new Error(error);
    }
  }

  async resetPassword(data: ResetPwdDto): Promise<string> {
    try {
      //VALIDA ID TWO PASSWORDS ARE SAME
      if (data.password !== data.repeatPassword) {
        this.badRequestException('Invalid data');
      }
      //TODO: IMPLEMENTAR PERSISTENCIA DE TOKENS
      const validateToken = data.token === '123';
      if (!validateToken) {
        this.badRequestException('Invalid data');
      }
      //TODO: OBTENER EL CORREO ASOCIADO AL TOKEN
      const userExist = await this.userService.findUserByEmail('email');
      const userId = userExist['id'];
      const email = userExist.email;
      const newPwd = await encryptPassword(data.password);
      const updateUser: UpdateUserDto = {
        password: newPwd,
      };
      //TODO: OBTENER EL ID DEL USUARIO
      const result = await this.userService.update(userId, updateUser);
      if (!result) {
        this.badRequestException('Invalid data');
      }
      //SEND MAIL NOTIFICATION WITH TOKEN
      const message = `Hola ${userExist.firstName}, su contraseña ha sido cambiada exitosamente.`;
      await this.sendMail(email, message, 'Cambio de contraseña');
      return `Email sent to ${email}`;
    } catch (error) {
      this.logger.error('User cannot chang e the password');
      throw new Error(error);
    }
  }

  private badRequestException(message: string) {
    throw new BadRequestException({
      message: message,
      error: true,
      status: 400,
    });
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
