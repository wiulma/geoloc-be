import { ApiProperty } from '@nestjs/swagger';

export class Coords {
  @ApiProperty()
  latitude: number;
  @ApiProperty()
  longitude: number;
  @ApiProperty()
  debugField?: string;
}
