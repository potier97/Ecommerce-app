import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigDataModule } from './config/config-data.module';
import { ConfigService } from '@nestjs/config';
import { Configuration } from './config/config.keys';
import { MongoModule } from './database/mongo.module';
import { HomeworkModule } from './homework/homework.module';

@Module({
  imports: [
    ConfigDataModule,
    MongoModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    ScheduleModule.forRoot(),
    TaskModule,
    HomeworkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  static port: number;

  constructor(private readonly configService: ConfigService) {
    AppModule.port = this.configService.get<number>(Configuration.PORT);
  }

  public onModuleInit(): void {
    this.logger.log(`Initialization...`);
    this.logger.log(`Running on environment: ${AppModule.port}`);
  }
}
