import { Controller, Post, Body } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { GetDataLocationDto } from './dto/get-data-location.dto';
import { GetDataLocationResponseDto } from './dto/get-data-location-response.dto';
import * as Sentry from '@sentry/node';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  async getData(
    @Body() dataDto: GetDataLocationDto,
  ): Promise<GetDataLocationResponseDto[]> {
    console.log('request params', dataDto);
    const result = await this.locationsService.getData(/*dataDto*/);
    Sentry.withScope((scope) => {
      scope.setTag('module', 'location');
      scope.setUser({ id: '123' });
      scope.setExtra('payload', dataDto);

      Sentry.captureMessage(`Getting location data: ${JSON.stringify(result)}`);
    });
    return result;
  }
}
