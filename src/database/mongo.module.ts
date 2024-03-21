import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import envConfig from 'src/config/env-config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [envConfig.KEY],
      useFactory: async (configService: ConfigType<typeof envConfig>) => {
        const { mongoUser, mongoPwd, mongoDb, mongoHost, mongoPort } =
          configService;
        const uri = `mongodb://${mongoUser}:${mongoPwd}@${mongoHost}:${mongoPort}/${mongoDb}`;
        console.log(`Connecting to ${uri} ...`);
        return {
          uri,
        };
      },
    }),
  ],
  exports: [MongooseModule],
})
export class MongoModule {}
