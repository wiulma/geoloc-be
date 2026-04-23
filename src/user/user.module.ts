import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { StorageService } from '../services/storage.service';

@Module({
  controllers: [UserController],
  providers: [UserService, StorageService],
})
export class UserModule {}
