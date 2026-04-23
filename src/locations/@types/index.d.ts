type GetPoiDataResponseDto = {
  found: number;
};

type CheckPoiRequestDto = {
  userId: number;
  poiId: number;
  latitude: number;
  longitude: number;
};

type Coords = {
  latitude: number;
  longitude: number;
};

type GetDataLocationDto = {
  coords: Coords;
  userId: string;
};

type LocationData = {
  id: number;
  coords: Coords;
  title: string;
  message: string;
  imageUrl: string;
};

type NearbyLocationData = LocationData & {
  distance: number;
};
