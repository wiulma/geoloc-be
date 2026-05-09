import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { StorageService } from '../services/storage.service';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class UserService {
  constructor(
    private readonly storageService: StorageService,
    private readonly notificationService: NotificationService,
    private readonly configService: ConfigService,
  ) {}

  async registerToken(
    userId: number,
    data: RegisterUserTokenDto,
  ): Promise<User> {
    const user = await this.findOne(userId);
    let result: User;
    if (user) {
      result = this.storageService.update({ userId, fcm: data.token });
      console.log('update user', userId, result);
    } else {
      result = this.storageService.add({ userId, fcm: data.token });
      console.log('create user', userId, result);
    }
    return result;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return Promise.resolve(this.storageService.getById(id));
  }

  add(user: User) {
    return this.storageService.add(user);
  }

  update(data: User) {
    return this.storageService.update(data);
  }
  async savePoiNotification(userId: number, idPoi: number) {
    const user = await this.findOne(userId);
    if (user) {
      user.poiNotification = user.poiNotification ?? [];
      if (user.poiNotification.length) {
        const idx = user.poiNotification.findIndex(
          (elm) => elm.idPoi === idPoi,
        );
        if (idx > -1) {
          user.poiNotification[idx].timestamp = new Date().getTime();
        } else {
          user.poiNotification.push({
            idPoi,
            timestamp: new Date().getTime(),
          });
        }
      }
    }
  }

  async needToNotifyPoi(
    userId: number,
    idPoi: number,
    lastLocalNotification?: number,
  ) {
    let result = true;
    const user = await this.findOne(userId);
    console.log('user to notify', user);
    const visited = user?.poiNotification?.find(
      (elm: PoiNotificationData) => elm.idPoi === idPoi,
    );
    console.log('poi last visited', visited);
    console.log(
      'visited check',
      'visited timestap',
      visited?.timestamp ?? 'NEVER',
      'now',
      Date.now(),
      'config DELAY_NEW_NOTIFICATION',
      this.configService.get('DELAY_NEW_NOTIFICATION'),
      'result',
      visited &&
        visited.timestamp - Date.now() <
          this.configService.get('DELAY_NEW_NOTIFICATION'),
    );
    console.log(
      'last local notification check',
      'lastLocalNotification',
      lastLocalNotification,
      'max',
      Number.MAX_VALUE,
      'config DELAY_NEW_NOTIFICATION',
      this.configService.get('DELAY_NEW_NOTIFICATION'),
      'result',
      this.configService.get('DELAY_NEW_NOTIFICATION'),
      (lastLocalNotification ?? Number.MAX_VALUE) - Date.now() <
        this.configService.get('DELAY_NEW_NOTIFICATION'),
    );

    if (
      (visited &&
        Date.now() - visited.timestamp <
          this.configService.get('DELAY_NEW_NOTIFICATION')) ||
      Date.now() - (lastLocalNotification ?? Number.MAX_VALUE) <
        this.configService.get('DELAY_NEW_NOTIFICATION')
    )
      result = false;
    console.log('needToNotifyPoi', result);
    return result;
  }

  async sendNotification(userId: number) {
    const user = await this.findOne(userId);
    if (!user) {
      throw new Error('Invalid user');
    }
    const location = {
      id: 1,
      coords: {
        longitude: 12.22509,
        latitude: 45.471339,
      },
      title: 'Via Marghera 1, Marghera',
      message: 'Via Marghera 1, Marghera',
      imageUrl:
        'https://maps.wikimedia.org/img/osm-intl,14,45.471339,12.225090,500x300.png',
    };
    this.notificationService.sendPush(user?.fcm, location).catch((err) => {
      throw err;
    });
  }
}
