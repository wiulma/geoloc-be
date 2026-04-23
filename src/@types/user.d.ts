type User = {
  userId: number;
  fcm: string;
  poiNotification?: PoiNotificationData[];
};

type PoiNotificationData = {
  idPoi: number;
  timestamp: number;
};
