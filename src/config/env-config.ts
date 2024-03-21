import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    nodeEnv: process.env.NODE_ENV,
    mongoUri: process.env.MONGODB_URI,
    mongoUser: process.env.MONGO_INITDB_ROOT_USERNAME,
    mongoPwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
    mongoDb: process.env.MONGO_DATABASE,
    mongoHost: process.env.MONGO_DATABASE_HOST,
    mongoPort: process.env.MONGO_DATABASE_PORT,
    port: process.env.PORT,
  };
});
