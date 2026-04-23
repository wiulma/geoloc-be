import { Injectable } from '@nestjs/common';
import { StorageService } from '../services/storage.service';

@Injectable()
export class UserService {
  constructor(private readonly storageService: StorageService) {}

  registerToken(userId: number, data: RegisterUserTokenDto) {
    const user = this.storageService.update({ userId, fcm: data.token });
    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return Promise.resolve(this.storageService.getById(id));
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

  async needToNotifyPoi(userId: number, idPoi: number) {
    let result = true;
    const user = await this.findOne(userId);
    const visited = user?.poiNotification?.find(
      (elm: PoiNotificationData) => elm.idPoi === idPoi,
    );
    if (
      visited &&
      visited.timestamp - Date.now() > +process.env.DELAY_NEW_NOTIFICATION!
    )
      result = false;
    return result;
  }
}
