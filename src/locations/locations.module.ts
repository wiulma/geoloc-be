import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { StorageService } from '../services/storage.service';
import { LoggingService } from '../services/logging.service';
import { NotificationService } from '../services/notification.service';
import { UserService } from '../user/user.service';
@Module({
  controllers: [LocationsController],
  providers: [
    LocationsService,
    StorageService,
    LoggingService,
    NotificationService,
    UserService,
  ],
})
export class LocationsModule {}
