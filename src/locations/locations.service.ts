import { LoggingService } from './../services/logging.service';
import { Injectable } from '@nestjs/common';

import { NotificationService } from '../services/notification.service';
import { UserService } from '../user/user.service';
import { FAKE_POIS } from './locations.data';

@Injectable()
export class LocationsService {
  private readonly NEARBY_RADIUS_METERS = 1000;
  readonly GEOFENCE_RADIUS_METERS = 300; // 50

  constructor(
    private loggingService: LoggingService,
    private notificationService: NotificationService,
    private userService: UserService,
  ) {}

  async getAll(): Promise<LocationData[]> {
    return Promise.resolve(FAKE_POIS);
  }
  /*
  async getData(data: GetDataLocationDto): Promise<GetPoiDataResponseDto> {
    const { latitude, longitude } = data.coords;
    console.log(
      `search by request coords. lat: ${latitude}, lon: ${longitude}`,
    );
    // return Promise.resolve(FAKE_DATA);

    const nearbyPOIs = FAKE_DATA.filter((poi: LocationData) => {
      const dist = this.getDistanceMeters(
        latitude,
        longitude,
        poi.coords.latitude,
        poi.coords.longitude,
      );
      return dist <= this.GEOFENCE_RADIUS_METERS;
    });

    if (nearbyPOIs.length > 0) {
      const userToken = (await this.userService.findOne(data.userId))?.fcm;
      if (userToken) {
        for (const poi of nearbyPOIs) {
          await this.notificationService.sendPush(userToken, poi);
        }
      }
    }

    return { found: nearbyPOIs.length };
  }
*/
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
      .filter((p) => p.distance < this.NEARBY_RADIUS_METERS)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 50);
    console.log('getNearby', lat, lng, result);
    return result;
  }

  findById(id: number) {
    return Promise.resolve(FAKE_POIS.find((elm) => elm.id === id));
  }

  async checkPoi(userId: number = 1, poi: LocationData, targetCoords: Coords) {
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
      this.GEOFENCE_RADIUS_METERS,
      distance <= this.GEOFENCE_RADIUS_METERS,
    );
    if (
      distance <= this.GEOFENCE_RADIUS_METERS &&
      (await this.userService.needToNotifyPoi(userId, poi.id))
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
          image: poi.imageUrl,
          poiId: poi.id.toString(),
        },
      };

      console.log('msgData', msgData);

      const user = await this.userService.findOne(userId);
      if (!user) throw new Error(`Invalid user: ${userId}`);

      this.notificationService
        .send(user.fcm, msgData)
        .then(() => this.userService.savePoiNotification(userId, poi.id))
        .catch((exc) =>
          console.log(
            `Error sending checkPoi: ${JSON.stringify(poi)}, exc: ${(exc as Error).message}`,
          ),
        );
    }
    return distance;
  }
}
