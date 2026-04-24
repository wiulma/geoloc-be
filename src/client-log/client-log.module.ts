import { Module } from '@nestjs/common';
import { ClientLogService } from './client-log.service';
import { ClientLogController } from './client-log.controller';

@Module({
  controllers: [ClientLogController],
  providers: [ClientLogService],
})
export class ClientLogModule {}
