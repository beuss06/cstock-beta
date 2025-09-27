// backend/src/main.ts
import 'reflect-metadata'; // nécessaire pour les décorateurs (Swagger, Validation, etc.)
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // API sous /api
  app.setGlobalPrefix('api');

  // CORS pour le dev local (front 5173 -> api 3000)
  app.enableCors({ origin: true, credentials: true });

  // Validation globale DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: false,
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('C-Stock API')
    .setDescription('API C-Stock — Gestion de stock chantier')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Fermeture propre de Prisma/Nest
  const prisma = app.get(PrismaService);
  await prisma.enableShutdownHooks(app);

  const port = Number(process.env.API_PORT) || 3000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`API running on port ${port}`);
}

bootstrap();
