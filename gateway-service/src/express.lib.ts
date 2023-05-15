import { sendEvent } from './tmp.lib';
import { Request, Response, NextFunction } from 'express';

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

export function tracker(config: RatflowConfig) {
  return function trackerMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const reqData = {
      clientId: req.headers['x-client-id']?.toString() ?? 'clientId',
      sessionId: req.headers['x-session-id']?.toString() ?? 'sessionId',
      userAgent: req.headers['user-agent'],
      url: req.url,
    };

    req['clientData'] = reqData;

    req['sendRatflow'] = function ({ event, ...rest }) {
      const data: RatflowData = {
        ...reqData,
        eventName: event,
        date: new Date(),
        customData: rest,
      };
      if (config.immediate == false) {
        res.on('finish', () => {
          sendEvent({ auth: config, data });
        });
      } else {
        sendEvent({ auth: config, data });
      }
    };
    next();
  };
}
