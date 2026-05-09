import { Controller, Post, Body, Get } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { ConfigService } from '@nestjs/config';
import { Coords } from './dto/Coords.dto';
import { CheckPoiRequestDto } from './dto/CheckPoiRequestDto.dto';
import { type LocationConfig } from './dto/LocationConfig.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Location')
@Controller('location')
export class LocationsController {
  constructor(
    private readonly locationsService: LocationsService,
    private readonly configService: ConfigService,
  ) {}

  @Post('nearby-pois')
  @ApiBody({ type: Coords })
  getNearby(@Body() body: Coords) {
    const { latitude, longitude } = body;
    return this.locationsService.getNearby(latitude, longitude);
  }

  @Post('check-poi')
  @ApiBody({ type: CheckPoiRequestDto })
  async checkPoi(@Body() body: CheckPoiRequestDto) {
    const { poiId, latitude, longitude, userId } = body;
    console.log('check-poi', body);
    const poi = await this.locationsService.findById(poiId);
    if (!poi) return { ok: false };
    const distance = await this.locationsService.checkPoi(
      userId,
      poi,
      {
        latitude,
        longitude,
      },
      body.lastLocalNotification,
    );

    return { ok: !!distance, distance };
  }

  @Get()
  getAll() {
    return this.locationsService.getAll();
  }

  @Get('config')
  getConfig(): LocationConfig {
    return {
      nearbyDistanceMeters:
        this.configService.get('NEARBY_RADIUS_METERS') ?? 500,
    };
  }
}
