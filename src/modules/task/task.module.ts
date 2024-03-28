import { Module } from '@nestjs/common';
import { TaskService } from './services/task.service';
import { TaskController } from './controllers/task.controller';

@Module({
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
