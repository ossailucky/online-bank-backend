import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
//import { NoCacheInterceptor } from 'no.cache.interceptor';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
  });
  const config = new DocumentBuilder()
    .setTitle('Investment API')
    .setDescription('API documentation for the Investment application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.enableCors({
    origin: ["http://localhost:8080"],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,

});

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/v1",app, document)

  //app.useGlobalInterceptors(new NoCacheInterceptor());

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
