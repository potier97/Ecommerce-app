import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateHomeworkDto } from './../dto/create-homework.dto';
import { UpdateHomeworkDto } from './../dto/update-homework.dto';
import { Homework } from '../entities/homework.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class HomeworkService {
  private readonly logger = new Logger(HomeworkService.name);

  constructor(
    @InjectModel(Homework.name) private homeworkModel: Model<Homework>
  ) {}

  public async create(createHomeworkDto: CreateHomeworkDto): Promise<unknown> {
    const result = await this.homeworkModel.create(createHomeworkDto);
    this.logger.log(`Create a new homework: ${result.id}`);
    return {
      id: result.id,
      title: result.title,
      description: result.description,
      active: result.active,
      status: result.status,
    };
  }

  public async findAll(): Promise<Homework[]> {
    const result = await this.homeworkModel
      .find({}, { title: 1, description: 1, active: 1, status: 1 })
      .exec();
    this.logger.log(`Return all homeworks ${result.length}`);
    return result;
  }

  public async findOne(id: string): Promise<Homework> {
    this.logger.log(`Find Homework: ${id}`);
    const result = await this.homeworkModel
      .findOne(
        { _id: id },
        { _id: 0, title: 1, description: 1, active: 1, status: 1 }
      )
      .exec();
    if (!result) {
      this.logger.log(`Homework not found: ${id}`);
      throw new NotFoundException({
        message: 'Homework not found',
        error: true,
        status: 404,
      });
    }
    return result;
  }

  public async update(
    id: string,
    updateHomeworkDto: UpdateHomeworkDto
  ): Promise<Homework> {
    const result = await this.homeworkModel.findOne({ _id: id }).exec();
    if (!result) {
      this.logger.log(`Homework not found: ${id}`);
      throw new NotFoundException({
        message: 'Homework not found',
        error: true,
        status: 404,
      });
    }
    const updated = await this.homeworkModel.findOneAndUpdate(
      { _id: id },
      { $set: updateHomeworkDto },
      { new: true }
    );
    return {
      title: updated.title,
      description: updated.description,
      active: updated.active,
      status: updated.status,
    };
  }

  public async remove(id: string): Promise<boolean> {
    const result = await this.homeworkModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      this.logger.log(`Homework not found: ${id}`);
      throw new NotFoundException({
        message: 'Homework not found',
        error: true,
        status: 404,
      });
    }
    return true;
  }
}
