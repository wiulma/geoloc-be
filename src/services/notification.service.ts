import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { BaseMessage } from 'firebase-admin/messaging';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationService {
  sentNotifications = new Map<string, number>();
  constructor(private configService: ConfigService) {}
  setupFirebase(): void {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: this.configService.get('FB_PROJECT_ID'),
        clientEmail: this.configService.get('FB_CLIENT_EMAIL'),
        privateKey: this.configService
          .get('FB_PRIVATE_KEY')
          .replace(/\\n/g, '\n'),
      }),
    });
  }

  shouldSend(userId: number, poiId: number) {
    const key = `${userId}_${poiId}`;
    const now = Date.now();
    const last = this.sentNotifications.get(key);

    console.log(
      'notification service should send',
      key,
      now,
      'last',
      last,
      'config DELAY_NEW_NOTIFICATION',
      this.configService.get('DELAY_NEW_NOTIFICATION'),
    );
    console.log(
      'result check',
      'last',
      last ?? 'never',
      'now-last',
      now - (last ?? 0),
      'check',
      !last || now - last > this.configService.get('DELAY_NEW_NOTIFICATION'),
    );

    if (
      !last ||
      now - last > this.configService.get('DELAY_NEW_NOTIFICATION')
    ) {
      this.sentNotifications.set(key, now);
      return true;
    }

    return false;
  }

  async send(token: string, msg: BaseMessage) {
    if (!token) {
      console.log(`Invalid user token, user`);
      return;
    }
    return admin
      .messaging()
      .send({
        token,
        ...msg,
        android: {
          collapseKey: `fntf_${Date.now()}`, // unique
        },
        apns: {
          headers: {
            'apns-collapse-id': `fntf_${Date.now()}`,
          },
        },
      })
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
        android: {
          collapseKey: `poi_${poi.id}_${Date.now()}`, // unique
        },
        apns: {
          headers: {
            'apns-collapse-id': `poi_${poi.id}_${Date.now()}`,
          },
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
