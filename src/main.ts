import './instruments';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NotificationService } from './services/notification.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';

import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(helmet());
  app.use(compression());
  const config = new DocumentBuilder()
    .setTitle('POC Geolocalization Geofence with notification')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('User')
    .addTag('Location')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.get(NotificationService).setupFirebase();
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap().catch((exc) =>
  console.error('Error bootstrap app', (exc as Error).message),
);
