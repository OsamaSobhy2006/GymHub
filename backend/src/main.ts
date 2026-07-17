import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv'
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true
  });
  
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )
  app.useGlobalInterceptors(
  new ClassSerializerInterceptor(app.get(Reflector)),
);

  app.use(helmet({contentSecurityPolicy: false}))

  app.enableCors({
    origin: [
      'http://localhost:4200'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  })

  const config = new DocumentBuilder()
    .setTitle('Gym Management System')
    .setDescription('REST API for Gym Management System')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('http://localhost:8000')
    .build()

    const document = SwaggerModule.createDocument(app, config)

    SwaggerModule.setup('api/docs', app, document)
  
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
