import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ClientLogService } from './client-log.service';
import { CreateClientLogDto } from './dto/create-client-log.dto';

@Controller('client-log')
export class ClientLogController {
  constructor(private readonly clientLogService: ClientLogService) {}

  @Post()
  @HttpCode(204)
  create(@Body() createClientLogDto: CreateClientLogDto) {
    this.clientLogService.create(createClientLogDto);
  }
}
