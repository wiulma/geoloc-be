import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LocationsModule } from './locations/locations.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import AppConfig from './config/AppConfig';
import { validationSchema } from './config/validation.schema';
import { ClientLogModule } from './client-log/client-log.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      validationSchema,
    }),
    LocationsModule,
    UserModule,
    ClientLogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
