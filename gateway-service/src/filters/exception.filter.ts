import { Catch, ExceptionFilter, ExecutionContext } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import * as Sentry from '@sentry/node';

@Catch()
export class SentryFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  catch(exception: any, host: ExecutionContext) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    let status = 500;
    if (exception.getStatus instanceof Function) {
      status = exception.getStatus();
    }
    if (exception.statusCode) {
      status = exception.statusCode;
    }
    let body = {};
    if (exception.getResponse instanceof Function) {
      body = exception?.getResponse() ?? {};
    }
    const context = response?.metadata?.customContext ?? 'unknown';

    if (process.env.SENTRY_DSN && process.env.TRACK_ERRORS === 'true') {
      Sentry.captureException(exception, {
        user: request?.user,
        extra: {
          request: {
            headers: request?.headers,
            method: request?.method,
            url: request.headers.host + request?.url,
            params: request?.params,
            query: request?.query,
            body: request?.body,
          },
          response: {
            statusCode: status,
            body: body,
          },
          context: context,
        },
      });
    }
    super.catch(exception, host);
  }
}
