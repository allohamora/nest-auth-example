import pkg from '../package.json';
import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { EntityNotFoundExceptionFilter } from './utils/entity-not-found-exception.filter';

const SWAGGER_PATH = 'swagger';
const SERVER_PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle(pkg.name)
    .setDescription(pkg.description)
    .setVersion(pkg.version)
    .addBearerAuth()
    .build();

  app.setGlobalPrefix('api');
  app.enableVersioning({ defaultVersion: '1', type: VersioningType.URI });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, document);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new EntityNotFoundExceptionFilter());

  await app.listen(SERVER_PORT);
}
bootstrap();
