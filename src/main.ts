import './instruments';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NotificationService } from './services/notification.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.get(NotificationService).setupFirebase();
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
