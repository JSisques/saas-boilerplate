import { AppModule } from '@/app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  let app;
  let logger;

  try {
    app = await NestFactory.create(AppModule, {
      bufferLogs: true,
    });

    logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
    app.useLogger(logger);

    // Global prefix
    app.setGlobalPrefix('api');

    // API versioning
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // CORS
    app.enableCors({
      origin: process.env.FRONTEND_URL || '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    const port = process.env.PORT || 4100;
    await app.listen(port);

    const url = await app.getUrl();
    logger.log(`🚀 Server is running on ${url}`);
  } catch (error) {
    if (logger) {
      logger.error(`🚀 Error starting the application: ${error}`);
    } else {
      console.error(`🚀 Error starting the application: ${error}`);
    }
    process.exit(1);
  }
}
bootstrap();
