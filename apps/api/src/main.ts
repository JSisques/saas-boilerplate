import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('NestApplication');
  const app = await NestFactory.create(AppModule);

  // Global configuration
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());

  // Start server
  await app.listen(process.env.API_PORT ?? 3000);
  const appUrl = await app.getUrl();
  logger.log(`🚀 Server ready at ${appUrl}`);
}
bootstrap();
