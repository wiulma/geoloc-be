import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { BaseMessage } from 'firebase-admin/messaging';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationService {
  constructor(private configService: ConfigService) {}
  setupFirebase(): void {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: this.configService.get('FB_PROJECT_ID'),
          clientEmail: this.configService.get('FB_CLIENT_EMAIL'),
          privateKey: this.configService
            .get('FB_PRIVATE_KEY')
            .replace(/\\n/g, '\n'),
        }),
      });
    } catch (exc) {
      throw new Error(exc);
    }
  }

  async send(token: string, msg: BaseMessage) {
    if (!token) {
      console.log(`Invalid user token, user`);
      return;
    }
    return admin
      .messaging()
      .send({ token, ...msg })
      .catch((exc) =>
        console.log(
          `Error sending message: ${JSON.stringify(msg)}, exc: ${(exc as Error).message}`,
        ),
      );
  }

  async sendPush(token: string, poi: LocationData) {
    try {
      console.log('try send message', token, poi);
      const res = await admin.messaging().send({
        token,
        notification: {
          title: poi.title,
          body: poi.message,
        },
        data: {
          image: poi.imageUrl,
          poiId: poi.id.toString(),
        },
      });

      console.log('Result send notification', res);
    } catch (exc) {
      console.error(
        'Error sending firebase notification',
        (exc as Error).message,
      );
    }
  }
}
