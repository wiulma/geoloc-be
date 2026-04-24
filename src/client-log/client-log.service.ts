import { Injectable } from '@nestjs/common';
import { CreateClientLogDto } from './dto/create-client-log.dto';

@Injectable()
export class ClientLogService {
  create(createClientLogDto: CreateClientLogDto) {
    console.log('client-message', createClientLogDto);
  }
}
