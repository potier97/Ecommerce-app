import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Status, TaskInterface } from '../model/taks';
import { TaskDto, UpdateTaskDto } from '../dto/task.dto';
import { v4 } from 'uuid';
import { Interval } from '@nestjs/schedule';
import { faker } from '@faker-js/faker';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  private readonly tasks: TaskInterface[] = [];

  public findAll(): TaskInterface[] {
    return this.tasks.filter((t: TaskInterface) => t.active);
  }

  public create(task: TaskDto): TaskInterface {
    const newTask: TaskInterface = {
      id: v4().toString(),
      title: task.title,
      active: task.active,
      description: task.description,
      status: Status.OPEN,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.tasks.push(newTask);
    return newTask;
  }

  public update(id: string, task: UpdateTaskDto): TaskInterface {
    const taskIndex = this.tasks.find((t: TaskInterface) => t.id === id);
    if (taskIndex && taskIndex.active) {
      const updatedTask: TaskInterface = {
        ...taskIndex,
        ...task,
        updatedAt: new Date().toISOString(),
      };
      this.tasks[this.tasks.indexOf(taskIndex)] = updatedTask;
      return updatedTask;
    }
    throw new NotFoundException({
      message: 'Task not found',
      error: true,
      status: 404,
    });
  }

  public delete(id: string): boolean {
    const taskIndex = this.tasks.find((t: TaskInterface) => t.id === id);
    if (taskIndex && taskIndex.active) {
      const deleteTask: TaskInterface = {
        ...taskIndex,
        active: false,
      };
      this.tasks[this.tasks.indexOf(taskIndex)] = deleteTask;
      return true;
    }
    throw new NotFoundException({
      message: 'Task not found',
      error: true,
      status: 404,
    });
  }

  @Interval(30000)
  handleAddTaskCron(): void {
    this.logger.debug('Add random task every 30 seconds');
    const newTask: TaskDto = {
      title: `${faker.company.name()} - ${faker.person.fullName()} - ${faker.lorem.word()}`,
      active: true,
      description: faker.lorem.sentence({ min: 12, max: 18 }),
    };
    this.create(newTask);
  }

  @Interval(60000)
  handleUpdatedTaskCron(): void {
    this.logger.debug('Update status random task every minute');
    if (this.tasks.length === 0) {
      return;
    }
    const newTask: UpdateTaskDto = {
      status: Status.IN_PROGRESS,
    };
    const randomTask =
      this.tasks[Math.floor(Math.random() * this.tasks.length)];
    this.update(randomTask.id, newTask);
  }

  @Interval(1200000)
  handleDeleteTaskCron(): void {
    this.logger.debug('Delete random task every 2 minutes');
    if (this.tasks.length === 0) {
      return;
    }
    const randomTask =
      this.tasks[Math.floor(Math.random() * this.tasks.length)];
    this.delete(randomTask.id);
  }
}
