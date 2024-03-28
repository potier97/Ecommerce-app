import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Logger,
  Get,
  HttpException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
//SERVICES
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guard/local-auth/local-auth.guard';
import { SignUpDto } from '../dto/signup.dto';
import { JwtAuthGuard } from '../guard/jwt-auth/jwt-auth.guard';
import { RefreshJwtAuthGuard } from '../guard/refresh-jwt-auth/refresh-jwt-auth.guard';
//SHARED
import { IUserCredential } from 'shared/interfaces/userCredential.interface';
import { CustomResponseDto } from 'shared/interfaces/customResponse.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  signUp(@Body() user: SignUpDto) {
    return this.authService.signUp(user);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    this.logger.log(`User ${req.user.user.email} logged in`);
    return req.user;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
  async refresh(@Request() req): Promise<IUserCredential> {
    this.logger.log(`User ${req.user.email} has refreshed the token`);
    return await this.authService.generateToken(req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  public async getProfile(@Request() req): Promise<CustomResponseDto<any>> {
    try {
      this.logger.log(`User ${req.user.email} get profile`);
      return {
        status: true,
        message: 'Profile',
        content: await this.authService.getProfile(req.user.email),
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Unauthorized',
          content: false,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
