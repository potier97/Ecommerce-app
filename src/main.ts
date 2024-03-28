import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import { ConfigService } from '@nestjs/config';
import { Configuration } from './config/config.keys';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //ADDTHE ENV VARS
  const configService: ConfigService = app.get(ConfigService);

  // PORT
  const port = configService.get<number>(Configuration.PORT);
  // console.log('PORT', port);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  app.enableCors();

  app.use(helmet());

  app.use(compression());

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Task Api')
    .setDescription('The task API description')
    .setVersion('1.0.0')
    .addTag('tasks')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const globalPrefix = 'v1';
  // const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    Logger.log(
      '🚀 Application is listening at http://localhost:' +
        port +
        '/' +
        globalPrefix
    );
  });
}
bootstrap();
