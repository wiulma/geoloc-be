import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LocationsModule } from './locations/locations.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import AppConfig from './config/AppConfig';
import { validationSchema } from './config/validation.schema';
import { ClientLogModule } from './client-log/client-log.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      validationSchema,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
    LocationsModule,
    UserModule,
    ClientLogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
