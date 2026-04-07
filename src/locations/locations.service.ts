import { Injectable } from '@nestjs/common';
import { GetDataLocationResponseDto } from './dto/get-data-location-response.dto';

const FAKE_DATA = [
  {
    location: {
      coords: {
        latitude: 45.436324,
        longitude: 12.206216,
      },
    },
    title: 'Malcontenta raccolta',
    message: 'Malcontenta raccolta',
    imageUrl: 'https://placehold.co/600x400',
  },
  {
    location: {
      coords: {
        latitude: 45.436493,
        longitude: 12.205095,
      },
    },
    title: 'Malcontenta chiesa',
    message: 'Malcontenta chiesa',
    imageUrl: 'https://placehold.co/600x400',
  },
  {
    location: {
      coords: {
        latitude: 45.437131,
        longitude: 12.205028,
      },
    },
    title: 'Malcontenta Ferramenta',
    message: 'Malcontenta Ferramenta',
    imageUrl: 'https://placehold.co/600x400',
  },
];

@Injectable()
export class LocationsService {
  async getData() /*data: GetDataLocationDto,*/
  : Promise<GetDataLocationResponseDto[]> {
    return Promise.resolve(FAKE_DATA);
  }
}
