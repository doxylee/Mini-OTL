import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { requestLogMiddlware } from './requestLog.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  if (app.get(ConfigService).get('LOG_REQUESTS') === 'true') app.use(requestLogMiddlware);

  await app.listen(3000);
}
bootstrap();
