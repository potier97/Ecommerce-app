import { Test, TestingModule } from '@nestjs/testing';
import { TaskModule } from './task.module';
import { TaskController } from './controllers/task.controller';
import { TaskService } from './services/task.service';

describe('TaskModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [TaskModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide TaskController', () => {
    const controller = module.get<TaskController>(TaskController);
    expect(controller).toBeDefined();
  });

  it('should provide ExampleService', () => {
    const service = module.get<TaskService>(TaskService);
    expect(service).toBeDefined();
  });
});
