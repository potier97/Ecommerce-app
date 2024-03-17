import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from '../service/task.service';
import { Status, TaskInterface } from '../model/taks';
import { faker } from '@faker-js/faker';
import { TaskDto, UpdateTaskDto } from '../dto/task.dto';

describe('TaskController', () => {
  let controller: TaskController;
  let taskService: TaskService;

  const repeatTimes = 10;
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
      controllers: [TaskController],
      providers: [TaskService],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of tasks', () => {
    jest.spyOn(taskService, 'findAll').mockReturnValue(tasks);
    expect(controller.findAll()).toEqual(tasks);
    expect(controller.findAll()).toHaveLength(repeatTimes);
  });

  it('should create a new task', () => {
    const id = faker.string.uuid();
    const task: TaskDto = {
      title: `${faker.company.name()} - ${faker.person.fullName()} - ${faker.lorem.word()}`,
      active: true,
      description: faker.lorem.sentence({ min: 12, max: 18 }),
    };
    const createdTask: TaskInterface = {
      id: id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: Status.OPEN,
      ...task,
    };
    jest.spyOn(taskService, 'create').mockReturnValue(createdTask);
    expect(controller.create(task)).toEqual(createdTask);
    expect(controller.create(task).id).toEqual(id);
  });

  it('should update an existing task', () => {
    const updatedTask: TaskInterface = tasks[0];
    const id = updatedTask.id;
    const updateTask: UpdateTaskDto = {
      title: `${faker.company.name()} - ${faker.person.fullName()} - ${faker.lorem.word()}`,
      status: Status.IN_PROGRESS,
    };
    updatedTask.title = updateTask.title;
    updatedTask.status = updateTask.status;
    jest.spyOn(taskService, 'update').mockReturnValue(updatedTask);
    expect(controller.update(id, updateTask)).toEqual(updatedTask);
    expect(tasks[0]).toEqual(updatedTask);
    expect(tasks[0].id).toEqual(id);
    expect(tasks[0].status).toEqual(Status.IN_PROGRESS);
    expect(tasks[0].title).toEqual(updateTask.title);
  });

  it('should delete an existing task', () => {
    const deleteTask: TaskInterface = tasks[5];
    const taskId = deleteTask.id;
    const resultMock = jest.spyOn(taskService, 'delete').mockReturnValue(true);
    expect(controller.delete(taskId)).toEqual(true);
    expect(resultMock).toHaveBeenCalledWith(taskId);
  });
});
