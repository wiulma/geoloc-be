export default (): EnvConfigData => ({
  FB_PROJECT_ID: process.env.FB_PROJECT_ID!,
  FB_PRIVATE_KEY: process.env.FB_PRIVATE_KEY!,
  FB_CLIENT_EMAIL: process.env.FB_CLIENT_EMAIL!,
  DELAY_NEW_NOTIFICATION: parseInt(process.env.DELAY_NEW_NOTIFICATION!),
  NEARBY_RADIUS_METERS: parseInt(process.env.NEARBY_RADIUS_METERS!),
  GEOFENCE_RADIUS_METERS: parseInt(process.env.GEOFENCE_RADIUS_METERS!),
});
