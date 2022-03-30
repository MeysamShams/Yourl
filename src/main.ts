import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from 'fastify-cookie';

async function bootstrap() {
  // fastify setup
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  // swagger configuration
  const config = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('Yourl API\'s')
  .setVersion('1.0')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors()

  app.register(fastifyCookie, {
    secret: 'R@fg5J7&viE%1!*h', // for cookies signature
  });
  
  await app.listen(3001);
}
bootstrap();
