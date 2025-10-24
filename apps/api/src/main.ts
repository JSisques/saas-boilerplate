import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger(AppModule.name);

  try {
    const app = await NestFactory.create(AppModule);

    await app.listen(process.env.PORT ?? 4100);

    const url = await app.getUrl();
    logger.log(`🚀 Server is running on ${url}`);
  } catch (error) {
    logger.error(`🚀 Error starting the application: ${error}`);
    process.exit(1);
  }
}
bootstrap();
