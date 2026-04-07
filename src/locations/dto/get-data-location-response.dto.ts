import { Location } from './location.dto';

export class GetDataLocationResponseDto {
  readonly location: Location;
  readonly title: string;
  readonly message: string;
  readonly imageUrl: string;
}
