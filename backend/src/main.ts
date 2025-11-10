import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './pipes/validation.pipe';
import helmet from 'helmet';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'https://kupipodariday.albert.nomoredomainswork.ru',
      'http://kupipodariday.albert.nomoredomainswork.ru',
    ],
  });

  app.useGlobalPipes(new ValidationPipe());

  app.use(helmet());

  await app.listen(PORT);
}
bootstrap();
