import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { sendEvent } from './tmp.lib';

interface RatflowConfig {
  appId: string;
  appSecret: string;
  service?: string;
  immediate?: boolean;
}

interface RatflowData {
  tag?: string;
  clientId?: string;
  sessionId?: string;
  eventName: string;
  url: string;
  userAgent: string;
  date: Date;
  //we can add whatever we want here
  customData?: any;
}

export class RatFlowInterceptor implements NestInterceptor {
  constructor(private config: RatflowConfig) {
    this.config = config;
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToRpc();
    const config = this.config;
    const reqData = {
      clientId: ctx.getData()['clientId'],
      sessionId: ctx.getData()['sessionId'],
      userAgent: ctx.getData()['userAgent'],
      url: ctx.getData()['url'],
    };
    ctx.getContext().getArgs()['sendRatflowIntercept'] = function ({
      event,
      ...rest
    }) {
      const data: RatflowData = {
        ...reqData,
        eventName: event,
        date: new Date(),
        customData: rest,
      };
      sendEvent({ auth: config, data });
    };
    return next.handle();
  }
}
