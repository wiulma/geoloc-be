import { Coords } from './Coords.dto';

export class NearbyLocationData {
  id: number;
  coords: Coords;
  title: string;
  message: string;
  imageUrl: string;
  distance: number;
}
