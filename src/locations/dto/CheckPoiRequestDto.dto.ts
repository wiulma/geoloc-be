export class CheckPoiRequestDto {
  userId: number;
  poiId: number;
  latitude: number;
  longitude: number;
  lastLocalNotification?: number;
}
