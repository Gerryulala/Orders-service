import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import * as dotenv from 'dotenv';

// Carga las variables de entorno
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('dev'));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 App corriendo en http://localhost:${port}`);
}
bootstrap();
