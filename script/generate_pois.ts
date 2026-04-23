import fs from 'node:fs';
import path from 'node:path';

type Coords = {
  latitude: number;
  longitude: number;
};

type LocationData = {
  id: number;
  coords: Coords;
  title: string;
  message: string;
  imageUrl: string;
};

const areas = [
  { name: 'Marghera', center: { lat: 45.47, lon: 12.23 }, count: 60 },
  { name: 'Mestre', center: { lat: 45.49, lon: 12.24 }, count: 50 },
  { name: 'Oriago', center: { lat: 45.46, lon: 12.26 }, count: 50 },
  { name: 'Malcontenta', center: { lat: 45.44, lon: 12.28 }, count: 40 },
];

let id = 1;
const pois: LocationData[] = [];

function randomOffset() {
  return (Math.random() - 0.5) * 0.01;
}

areas.forEach((area) => {
  for (let i = 0; i < area.count; i++) {
    const lat = area.center.lat + randomOffset();
    const lon = area.center.lon + randomOffset();

    const address = `Via ${area.name} ${i + 1}, ${area.name}`;

    pois.push({
      id: id++,
      coords: {
        longitude: parseFloat(lon.toFixed(6)),
        latitude: parseFloat(lat.toFixed(6)),
      },
      title: address,
      message: address,
      imageUrl: `https://maps.wikimedia.org/img/osm-intl,14,${lat.toFixed(6)},${lon.toFixed(6)},500x300.png`,
    });
  }
});

fs.writeFileSync(path.resolve('.', 'pois.json'), JSON.stringify(pois, null, 2));
