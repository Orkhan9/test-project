import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppConfigService } from './utils/app-config.service';
import { config } from 'aws-sdk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const configDocument = new DocumentBuilder()
    .setTitle('Test project')
    .setDescription('File upload AWS')
    .setVersion('1.0')
    .addTag('api')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();

  const document = SwaggerModule.createDocument(app, configDocument);

  SwaggerModule.setup('api/swagger', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const appConfigService = app.get(AppConfigService);
  config.update({
    accessKeyId: appConfigService.AWS_ACCESS_KEY_ID,
    secretAccessKey: appConfigService.AWS_SECRET_ACCESS_KEY,
    region: appConfigService.AWS_REGION,
  });
  await app.listen(appConfigService.PORT || 3000);
}
bootstrap();
