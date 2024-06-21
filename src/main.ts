import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exception.filter';

const cors = require("cors");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors({
    origin: "*",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }));
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3501);
}

bootstrap();
