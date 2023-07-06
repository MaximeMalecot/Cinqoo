import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import * as Sentry from '@sentry/node';

@Catch()
export class SentryFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (process.env.SENTRY_DSN && process.env.TRACK_ERRORS === 'true') {
      Sentry.captureException(exception);
    }
    super.catch(exception, host);
  }
}
