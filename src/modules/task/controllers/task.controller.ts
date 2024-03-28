import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Version,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
//SHARED
import { TaskService } from '../services/task.service';
import { TaskDto, UpdateTaskDto } from '../dto/task.dto';
import { TaskInterface } from 'shared/interfaces/taks.interface';

@ApiTags('task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Version('1')
  @Get()
  public findAll(): TaskInterface[] {
    return this.taskService.findAll();
  }

  @Version('1')
  @Post()
  public create(@Body() task: TaskDto): TaskInterface {
    return this.taskService.create(task);
  }

  @Version('1')
  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden for this source.' })
  @ApiResponse({ status: 401, description: 'The taks cannot be updated' })
  public update(
    @Param('id') taskId: string,
    @Body() task: UpdateTaskDto
  ): TaskInterface {
    return this.taskService.update(taskId, task);
  }

  @Version('1')
  @Delete(':id')
  public delete(@Param('id') taskId: string): boolean {
    return this.taskService.delete(taskId);
  }
}
