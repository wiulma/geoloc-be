import { LoggingService } from './../services/logging.service';
import { Injectable } from '@nestjs/common';

import { NotificationService } from '../services/notification.service';
import { UserService } from '../user/user.service';
import { FAKE_POIS } from './locations.data';
import { ConfigService } from '@nestjs/config';
import { type LocationData } from './dto/LocationData.dto';
import { type NearbyLocationData } from './dto/NearbyLocationData.dto';
import { type Coords } from './dto/Coords.dto';

@Injectable()
export class LocationsService {
  constructor(
    private loggingService: LoggingService,
    private notificationService: NotificationService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  async getAll(): Promise<LocationData[]> {
    return Promise.resolve(FAKE_POIS);
  }
  toRad = (x: number) => (x * Math.PI) / 180;

  getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371000; // meters

    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  async getNearby(lat: number, lng: number): Promise<NearbyLocationData[]> {
    //FIXME: select by spatial query filter
    const pois: LocationData[] = await this.getAll();
    const result = pois
      .map((p) => ({
        ...p,
        distance: this.getDistanceMeters(
          lat,
          lng,
          p.coords.latitude,
          p.coords.longitude,
        ),
      }))
      .filter(
        (p) => p.distance < this.configService.get('NEARBY_RADIUS_METERS'),
      )
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 50);
    console.log('getNearby', lat, lng, result);
    return result;
  }

  findById(id: number) {
    return Promise.resolve(FAKE_POIS.find((elm) => elm.id === id));
  }

  async checkPoi(
    userId: number = 1,
    poi: LocationData,
    targetCoords: Coords,
    lastLocalNotification?: number,
  ) {
    const { latitude, longitude } = targetCoords;
    const { latitude: poiLatitude, longitude: poiLongitude } = poi.coords;
    const distance = this.getDistanceMeters(
      latitude,
      longitude,
      poiLatitude,
      poiLongitude,
    );
    console.log(
      'checkPoi distance',
      distance,
      this.configService.get('GEOFENCE_RADIUS_METERS'),
      distance <= this.configService.get('GEOFENCE_RADIUS_METERS'),
    );
    if (
      distance <= this.configService.get('GEOFENCE_RADIUS_METERS') &&
      (await this.userService.needToNotifyPoi(
        userId,
        poi.id,
        lastLocalNotification,
      ))
    ) {
      const data = {
        title: poi.title,
        lat: poiLatitude,
        lon: poiLongitude,
      };

      this.loggingService.sendMessage(
        userId,
        'location',
        'Send checked POI',
        data,
      );
      console.log('send message by firebase', userId, data);

      const msgData = {
        notification: {
          title: poi.title,
          body: poi.message,
        },
        data: {
          poiId: poi.id.toString(),
        },
      };

      console.log('msgData', msgData);

      const user = await this.userService.findOne(userId);
      if (!user) throw new Error(`Invalid user: ${userId}`);
      if (this.notificationService.shouldSend(userId, poi.id)) {
        this.notificationService
          .send(user.fcm, msgData)
          .then(() => this.userService.savePoiNotification(userId, poi.id))
          .catch((exc) =>
            console.log(
              `Error sending checkPoi: ${JSON.stringify(poi)}, exc: ${(exc as Error).message}`,
            ),
          );
      }
    }
    return distance;
  }
}
