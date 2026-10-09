import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  Employee,
  City,
  Center,
  Exam,
  Role,
  Shift,
  Duty,
  AttendanceFile,
} from '../entities';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const host = configService.get<string>('DB_HOST', 'localhost');
  const port = parseInt(configService.get<string>('DB_PORT', '3306'), 10);
  const database = configService.get<string>('DB_NAME', 'examduty');
  const username = configService.get<string>('DB_USER');
  const password = configService.get<string>('DB_PASSWORD');
  // Only needed when the MySQL server requires TLS (remote databases)
  const useSsl = configService.get<string>('DB_SSL', 'false') === 'true';

  const isProd = configService.get<string>('NODE_ENV') === 'production';
  const syncEnv = configService.get<string>('DB_SYNCHRONIZE');
  const synchronize = syncEnv !== undefined ? syncEnv === 'true' : !isProd;

  return {
    type: 'mysql',
    host,
    port,
    username,
    password,
    database,
    charset: 'utf8mb4',
    timezone: 'Z',
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    entities: [Employee, City, Center, Exam, Role, Shift, Duty, AttendanceFile],
    autoLoadEntities: true,
    synchronize,
    logging: ['error', 'warn'],
  };
};

export const databaseConfigAsync: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => getDatabaseConfig(configService),
};
