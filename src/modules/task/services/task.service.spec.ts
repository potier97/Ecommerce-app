import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
//SERVICES
import { TaskService } from './task.service';
import { TaskDto, UpdateTaskDto } from '../dto/task.dto';
import { TaskInterface } from 'shared/interfaces/taks.interface';
import { Status } from 'shared/interfaces/statusTask.enum';

describe('TaskService', () => {
  let service: TaskService;

  const repeatTimes = 20;
  const tasks: TaskInterface[] = Array.from({ length: repeatTimes }, () => {
    return {
      id: faker.string.uuid(),
      title: `${faker.company.name()} - ${faker.person.fullName()} - ${faker.lorem.word()}`,
      description: faker.lorem.sentence({ min: 12, max: 18 }),
      status: Status.OPEN,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskService],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of tasks', () => {
    jest.spyOn(service, 'findAll').mockReturnValue(tasks);
    expect(service.findAll()).toEqual(tasks);
    expect(service.findAll()).toHaveLength(repeatTimes);
  });

  it('should return an array of taskk without inactive tasks', () => {
    jest.spyOn(service, 'findAll').mockReturnValue([]);
    expect(service.findAll()).toEqual([]);
    expect(service.findAll()).toHaveLength(0);
  });

  it('should create a new task', () => {
    const taskDto: TaskDto = {
      title: 'New Task',
      active: true,
      description: 'Description',
    };
    const createdTask = service.create(taskDto);
    expect(createdTask).toHaveProperty('id');
    expect(createdTask.title).toEqual(taskDto.title);
    expect(createdTask.active).toEqual(taskDto.active);
    expect(createdTask.description).toEqual(taskDto.description);
    expect(createdTask.status).toEqual(Status.OPEN);
  });

  it('should update an existing task', () => {
    const newTask: TaskDto = {
      title: `${faker.company.name()} - ${faker.person.fullName()} - ${faker.lorem.word()}`,
      active: true,
      description: faker.lorem.sentence({ min: 12, max: 18 }),
    };
    const createdTask = service.create(newTask);
    const taskId = createdTask.id;
    const updateTaskDto: UpdateTaskDto = {
      status: Status.IN_PROGRESS,
    };
    const updatedTask = service.update(taskId, updateTaskDto);
    expect(updatedTask).toHaveProperty('id', taskId);
    expect(updatedTask.status).toEqual(updateTaskDto.status);
  });

  it('should throw NotFoundException if task not found', () => {
    const taskId = faker.string.uuid();
    const updateTaskDto: UpdateTaskDto = {
      status: Status.IN_PROGRESS,
    };
    expect(() => service.update(taskId, updateTaskDto)).toThrowError(
      NotFoundException
    );
  });

  it('should delete an existing task', () => {
    const newTask: TaskDto = {
      title: `${faker.company.name()} - ${faker.person.fullName()} - ${faker.lorem.word()}`,
      active: true,
      description: faker.lorem.sentence({ min: 12, max: 18 }),
    };
    const createdTask = service.create(newTask);
    const taskId = createdTask.id;
    const result = service.delete(taskId);
    expect(result).toEqual(true);
  });

  it('should throw NotFoundException if task not found', () => {
    const taskId = faker.string.uuid();
    expect(() => service.delete(taskId)).toThrowError(NotFoundException);
  });

  it('should add a random task every 30 seconds', async () => {
    await service.handleAddTaskCron();
    const tasks = service.findAll();
    expect(tasks.length).toBeGreaterThan(0);
  });

  it('should update status of random task every minute', async () => {
    const taskDto: TaskDto = {
      title: `${faker.company.name()} - ${faker.person.fullName()} - ${faker.lorem.word()}`,
      active: true,
      description: faker.lorem.sentence({ min: 12, max: 18 }),
    };
    const createdTask = service.create(taskDto);
    await service.handleUpdatedTaskCron();
    const updatedTask = service.findAll();
    const currentTask = updatedTask.find(task => task.id === createdTask.id);
    expect(currentTask.status).toEqual(Status.IN_PROGRESS);
  });

  it('should not update status if there are no tasks', async () => {
    await service.handleUpdatedTaskCron();
    const tasks = service.findAll();
    expect(
      tasks.every(task => task.status !== Status.IN_PROGRESS)
    ).toBeTruthy();
  });

  it('should delete random task every 2 minutes', async () => {
    const taskDto: TaskDto = {
      title: `${faker.company.name()} - ${faker.person.fullName()} - ${faker.lorem.word()}`,
      active: true,
      description: faker.lorem.sentence({ min: 12, max: 18 }),
    };
    const createdTask = service.create(taskDto);
    await service.handleDeleteTaskCron();
    const tasks = service.findAll();
    expect(tasks.every(task => task.id !== createdTask.id)).toBeTruthy();
  });

  it('should not delete any task if there are no tasks', async () => {
    await service.handleDeleteTaskCron();
    const tasksBefore = service.findAll();
    expect(tasksBefore.length).toEqual(0);
  });
});
