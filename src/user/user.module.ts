import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { StorageService } from '../services/storage.service';
import { NotificationService } from '../services/notification.service';

@Module({
  controllers: [UserController],
  providers: [UserService, StorageService, NotificationService],
})
export class UserModule {}
