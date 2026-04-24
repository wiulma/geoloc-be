import { Test, TestingModule } from '@nestjs/testing';
import { ClientLogService } from './client-log.service';

describe('ClientLogService', () => {
  let service: ClientLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientLogService],
    }).compile();

    service = module.get<ClientLogService>(ClientLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
