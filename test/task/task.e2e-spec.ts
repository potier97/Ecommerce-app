import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import * as request from 'supertest';
//IMPORTS
import { AppModule } from '../../src/app.module';
import { TaskService } from '../../src/task/service/task.service';
import { TaskDto, UpdateTaskDto } from '../../src/task/dto/task.dto';
import { Status } from '../../src/task/model/taks';

describe('TaskController (e2e)', () => {
  let app: INestApplication;
  let taskService: TaskService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    taskService = moduleFixture.get<TaskService>(TaskService);
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      })
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    taskService['tasks'] = [];
  });

  it('should create a new task', async () => {
    const taskDto: TaskDto = {
      title: `${faker.company.name()} - ${faker.person.fullName()} - ${faker.lorem.word()}`,
      description: faker.lorem.sentence({ min: 12, max: 18 }),
      active: true,
    };

    const response = await request(app.getHttpServer())
      .post('/task')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(taskDto)
      .expect(201);

    expect(response.body).toEqual(expect.objectContaining(taskDto));
    expect(response.body).toHaveProperty('id');
  });

  it('should create a new task witihout active', async () => {
    const taskDto = {
      title: `${faker.company.name()} - ${faker.person.fullName()} - ${faker.lorem.word()}`,
      description: faker.lorem.sentence({ min: 12, max: 18 }),
    };
    const response = await request(app.getHttpServer())
      .post('/task')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(taskDto)
      .expect(201);

    expect(response.body).toEqual(expect.objectContaining(taskDto));
    expect(response.body).toHaveProperty('id');
  });

  it('should return 400 when creating a task with null data', async () => {
    const invalidTaskDto = {};

    const response = await request(app.getHttpServer())
      .post('/task')
      .send(invalidTaskDto)
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: [
        'title must be longer than or equal to 3 characters',
        'title should not be empty',
        'title must be a string',
        'description must be longer than or equal to 3 characters',
        'description should not be empty',
        'description must be a string',
      ],
      error: 'Bad Request',
    });
  });

  it('should return 400 when creating a task with null title', async () => {
    const invalidTaskDto: TaskDto = {
      title: null,
      description: faker.lorem.sentence({ min: 12, max: 18 }),
      active: true,
    };

    const response = await request(app.getHttpServer())
      .post('/task')
      .send(invalidTaskDto)
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: [
        'title must be longer than or equal to 3 characters',
        'title should not be empty',
        'title must be a string',
      ],
      error: 'Bad Request',
    });
  });

  it('should return 400 when creating a task with empty title', async () => {
    const invalidTaskDto: TaskDto = {
      title: '',
      description: faker.lorem.sentence({ min: 12, max: 18 }),
      active: true,
    };

    const response = await request(app.getHttpServer())
      .post('/task')
      .send(invalidTaskDto)
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: [
        'title must be longer than or equal to 3 characters',
        'title should not be empty',
      ],
      error: 'Bad Request',
    });
  });

  it('should return 400 when creating a task with two words title', async () => {
    const invalidTaskDto: TaskDto = {
      title: 'as',
      description: faker.lorem.sentence({ min: 12, max: 18 }),
      active: true,
    };

    const response = await request(app.getHttpServer())
      .post('/task')
      .send(invalidTaskDto)
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: ['title must be longer than or equal to 3 characters'],
      error: 'Bad Request',
    });
  });

  it('should return 200 when creating a task with number title', async () => {
    const validTaskDto: TaskDto = {
      title: 123 as any,
      description: faker.lorem.sentence({ min: 12, max: 18 }),
      active: true,
    };

    const response = await request(app.getHttpServer())
      .post('/task')
      .send(validTaskDto)
      .expect(201);
    const task = taskService.findAll()[0];
    expect(response.body.id).toEqual(task.id);
  });

  it('should return 400 when creating a task with null description', async () => {
    const invalidTaskDto: TaskDto = {
      title: `${faker.company.name()} - ${faker.person.fullName()} - ${faker.lorem.word()}`,
      description: null,
      active: true,
    };

    const response = await request(app.getHttpServer())
      .post('/task')
      .send(invalidTaskDto)
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: [
        'description must be longer than or equal to 3 characters',
        'description should not be empty',
        'description must be a string',
      ],
      error: 'Bad Request',
    });
  });

  it('should return 400 when creating a task with empty description', async () => {
    const invalidTaskDto: TaskDto = {
      title: `${faker.company.name()} - ${faker.person.fullName()} - ${faker.lorem.word()}`,
      description: '',
      active: true,
    };

    const response = await request(app.getHttpServer())
      .post('/task')
      .send(invalidTaskDto)
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: [
        'description must be longer than or equal to 3 characters',
        'description should not be empty',
      ],
      error: 'Bad Request',
    });
  });

  it('should return 400 when creating a task with two words description', async () => {
    const invalidTaskDto: TaskDto = {
      title: `${faker.company.name()} - ${faker.person.fullName()} - ${faker.lorem.word()}`,
      description: 'qw',
      active: true,
    };

    const response = await request(app.getHttpServer())
      .post('/task')
      .send(invalidTaskDto)
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: ['description must be longer than or equal to 3 characters'],
      error: 'Bad Request',
    });
  });

  it('should return 200 when creating a task with number description', async () => {
    const validTaskDto: TaskDto = {
      title: `${faker.company.name()} - ${faker.person.fullName()} - ${faker.lorem.word()}`,
      description: 123 as any,
      active: true,
    };

    const response = await request(app.getHttpServer())
      .post('/task')
      .send(validTaskDto)
      .expect(201);
    const task = taskService.findAll()[0];
    expect(response.body.id).toEqual(task.id);
  });

  //ACTUALIZAR

  it('should update an existing task', async () => {
    const taskDto: TaskDto = {
      title: `${faker.company.name()} - ${faker.person.fullName()} - ${faker.lorem.word()}`,
      description: faker.lorem.sentence({ min: 12, max: 18 }),
      active: true,
    };
    const taskId = await taskService.create(taskDto).id;
    //SE ACTUALIZA EN PROGRESO
    const updateTaskDto: UpdateTaskDto = { status: Status.IN_PROGRESS };
    const response = await request(app.getHttpServer())
      .put(`/task/${taskId}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(updateTaskDto)
      .expect(200);

    expect(response.body).toEqual(expect.objectContaining(updateTaskDto));
    expect(response.body.id).toBe(taskId);
  });

  it('should cannot update an unexisting task', async () => {
    const taskId = faker.string.uuid();
    //SE ACTUALIZA EN PROGRESO
    const updateTaskDto: UpdateTaskDto = { status: Status.IN_PROGRESS };
    const response = await request(app.getHttpServer())
      .put(`/task/${taskId}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(updateTaskDto)
      .expect(404);

    expect(response.body).toEqual({
      message: 'Task not found',
      error: true,
      status: 404,
    });
  });

  it('should delete an existing task', async () => {
    const taskDto: TaskDto = {
      title: `${faker.company.name()} - ${faker.person.fullName()} - ${faker.lorem.word()}`,
      description: faker.lorem.sentence({ min: 12, max: 18 }),
      active: true,
    };
    const taskId = await taskService.create(taskDto).id;
    // Eliminar la tarea
    await request(app.getHttpServer())
      .delete(`/task/${taskId}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .expect(200);
    // Verificar que la tarea haya sido eliminada
    const tasks = await taskService.findAll();
    const deletedTask = tasks.find(task => task.id === taskId);
    expect(deletedTask).toBeUndefined();
    //TRATAR DE VOLVER A ELIMINAR LA TAREA DEBE DEVOLVER 404
    await request(app.getHttpServer())
      .delete(`/task/${taskId}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .expect(404);
  });

  it('should get all tasks', async () => {
    // Crear algunas tareas de prueba
    const newAcountTask = 5;
    const createdTasks = [];
    for (let i = 0; i < newAcountTask; i++) {
      const taskDto: TaskDto = {
        title: `${faker.company.name()} - ${faker.person.fullName()} - ${faker.lorem.word()}`,
        description: faker.lorem.sentence({ min: 12, max: 18 }),
        active: true,
      };
      const result = await taskService.create(taskDto);
      createdTasks.push(result);
    }
    // Obtener todas las tareas
    const response = await request(app.getHttpServer())
      .get('/task')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .expect(200);
    // Verificar que todas las tareas se devuelvan correctamente
    expect(response.body).toHaveLength(newAcountTask);
    expect(response.body).toEqual(
      expect.arrayContaining(
        createdTasks.map(task => expect.objectContaining(task))
      )
    );
  });

  it('should return 404 when deleting a non-existing task', async () => {
    const nonExistingTaskId = faker.string.uuid();

    const response = await request(app.getHttpServer())
      .delete(`/task/${nonExistingTaskId}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .expect(404);

    expect(response.body).toEqual({
      message: 'Task not found',
      error: true,
      status: 404,
    });
  });
});
