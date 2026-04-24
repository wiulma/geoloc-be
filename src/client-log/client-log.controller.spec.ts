import { Test, TestingModule } from '@nestjs/testing';
import { ClientLogController } from './client-log.controller';
import { ClientLogService } from './client-log.service';

describe('ClientLogController', () => {
  let controller: ClientLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientLogController],
      providers: [ClientLogService],
    }).compile();

    controller = module.get<ClientLogController>(ClientLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
