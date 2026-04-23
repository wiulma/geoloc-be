import { Controller, Post, Body, Get } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Controller('location')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  /*
  @Post()
  async getData(
    @Body() dataDto: GetDataLocationDto,
  ): Promise<GetPoiDataResponseDto> {
    console.log('request params', dataDto);
    const result = await this.locationsService.getData(dataDto);
    Sentry.withScope((scope) => {
      scope.setTag('module', 'location');
      scope.setUser({ id: '123' });
      scope.setExtra('payload', dataDto);

      Sentry.captureMessage(`Getting location data: ${JSON.stringify(result)}`);
    });
    return result;
  }
*/
  @Post('nearby-pois')
  getNearby(@Body() body: Coords) {
    const { latitude, longitude } = body;
    return this.locationsService.getNearby(latitude, longitude);
  }

  @Post('check-poi')
  async checkPoi(@Body() body: CheckPoiRequestDto) {
    const { poiId, latitude, longitude, userId } = body;

    const poi = await this.locationsService.findById(poiId);
    if (!poi) return { ok: false };
    const distance = this.locationsService.checkPoi(userId, poi, {
      latitude,
      longitude,
    });

    return { ok: !!distance, distance };
  }

  @Get()
  getAll() {
    return this.locationsService.getAll();
  }
}
