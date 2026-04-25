import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';

type T = Record<string, unknown> | string;

@Injectable()
export class LoggingService {
  sendMessage(userId: number, module: string, msg: string, data?: T) {
    Sentry.withScope((scope) => {
      scope.setTag('module', module);
      scope.setUser({ id: userId.toString() });
      scope.setExtra('payload', data);

      Sentry.captureMessage(`${msg}: ${JSON.stringify(data ?? {})}`);
    });
  }
}
