import { Module } from '@nestjs/common';
import { TaskService } from './service/task.service';
import { TaskController } from './controller/task.controller';

@Module({
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
