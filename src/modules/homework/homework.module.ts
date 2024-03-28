import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
//SERVICES
import { HomeworkService } from './services/homework.service';
import { HomeworkController } from './controllers/homework.controller';
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
