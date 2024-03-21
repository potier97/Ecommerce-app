import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
//SERVICES
import { HomeworkService } from './service/homework.service';
import { HomeworkController } from './controller/homework.controller';
import { Homework, HomeworkSchema } from './entities/homework.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Homework.name, schema: HomeworkSchema },
    ]),
  ],
  controllers: [HomeworkController],
  providers: [HomeworkService],
})
export class HomeworkModule {}
