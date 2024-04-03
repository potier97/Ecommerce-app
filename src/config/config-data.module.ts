import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
//CONFIG
import { Environments } from './environments';
import envConfig from './env-config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [envConfig],
      envFilePath: Environments[process.env.NODE_ENV] || `.env`,
      validationSchema: Joi.object({
        //ENVIRONMENT
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development')
          .required(),
        API_KEY: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_REFRESH_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_KEY: Joi.string().required(),
        PORT: Joi.number().default(3000),
        //DATABASE
        MONGODB_URI: Joi.string().required(),
        MONGO_INITDB_ROOT_USERNAME: Joi.string().required(),
        MONGO_INITDB_ROOT_PASSWORD: Joi.string().required(),
        MONGO_DATABASE: Joi.string().required(),
        MONGO_DATABASE_HOST: Joi.string().required(),
        MONGO_DATABASE_PORT: Joi.number().required(),
        //RESEND
        RESEND_API_KEY: Joi.string().required(),
        EMAIL_SENDER: Joi.string().required(),
      }),
      expandVariables: false,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigDataModule {}
