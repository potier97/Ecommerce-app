import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
//SERVICES
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Configuration } from './config/config.keys';
import { ConfigDataModule } from './config/config-data.module';
//GUARDS
import { AccessApiKeyGuard } from './auth/guard/access-api-key/access-api-key.guard';
//DATABASE
import { MongoModule } from './database/mongo.module';
//AUTH
import { AuthModule } from './auth/auth.module';
//MODULES
import { TaskModule } from './modules/task/task.module';
import { HomeworkModule } from './modules/homework/homework.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { PurchaseModule } from './modules/purchase/purchase.module';
import { PurchaseDetailModule } from './modules/purchase-detail/purchase-detail.module';

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
    UserModule,
    AuthModule,
    ProductModule,
    PurchaseModule,
    PurchaseDetailModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessApiKeyGuard,
    },
    AppService,
  ],
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
