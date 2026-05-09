import { PoiNotificationData } from './PoiNotificationData.dto';

export class User {
  userId: number;
  fcm: string;
  poiNotification?: PoiNotificationData[];
}
