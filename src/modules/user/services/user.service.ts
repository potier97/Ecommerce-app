import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
//DTO
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
//ENTITIES
import { User } from '../entities/user.entity';
import { Genre } from 'shared/interfaces/genre.enum';
import { UserType } from 'shared/interfaces/userType.enu';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser: User = {
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      password: createUserDto.password,
      genre: Genre[createUserDto.genre],
      lastName: createUserDto.lastName,
      role: UserType[createUserDto.role],
      familyName: createUserDto.familyName,
      secondName: createUserDto.secondName,
      phone: createUserDto.phone,
      completedProfile: false,
      status: true,
    };
    const result = await this.userModel.create(newUser);
    this.logger.log(`New user created with id: ${result.id}`);

    return result;
  }

  public async findUserByEmail(email: string): Promise<User> {
    return this.userModel
      .findOne({
        email,
      })
      .exec();
  }

  public async findAll(): Promise<User[]> {
    return await this.userModel.find({}, { password: 0 }).exec();
  }

  public async findOne(id: string): Promise<User> {
    this.logger.log(`Finding user with id: ${id}`);
    return await this.userModel.findOne({ _id: id }, { password: 0 }).exec();
  }

  public async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    this.logger.log(`Update user with id: ${id}`);
    const existingUser = await this.findUserByEmail(updateUserDto.email);
    if (existingUser && existingUser['id'] !== id) {
      throw new BadRequestException({
        message: 'El correo ya está en uso',
        error: true,
        status: 400,
      });
    }
    this.logger.log(`User Exist`);
    return await this.userModel
      .findOneAndUpdate({ _id: id }, updateUserDto, {
        projection: { password: 0 },
      })
      .exec();
  }

  public async remove(id: string): Promise<boolean> {
    const result = await this.userModel
      .findByIdAndUpdate({ _id: id, status: true }, { status: false })
      .exec();
    if (!result) {
      throw new BadRequestException({
        message: 'User not found',
        error: true,
        status: 400,
      });
    }
    return true;
  }
}
