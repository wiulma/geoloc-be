import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { BaseMessage } from 'firebase-admin/messaging';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationService {
  constructor(
    private readonly userService: UserService,
    private configService: ConfigService,
  ) {}
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

  async send(userId: number, msg: BaseMessage) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      console.log(`Invalid user: ${userId}`);
      return;
    }
    const token = user.fcm;
    if (!token) {
      console.log(`Invalid user token, user: ${userId}`);
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

  /*
    async sendPush(token: string, poi: LocationData) {
    try {
      await admin.messaging().send({
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
    } catch (exc) {
      console.log(
        `Error sending message: ${JSON.stringify(poi)}, exc: ${(exc as Error).message}`,
      );
    }
  }
  */
  async sendPush(token: string, poi: LocationData) {
    await admin.messaging().send({
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
  }
}
