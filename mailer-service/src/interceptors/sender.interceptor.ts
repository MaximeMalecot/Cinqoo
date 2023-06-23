import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class MailInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    console.log(context);

    return next.handle().pipe(
      tap(() => {
        console.log('After...');
        const res = context.switchToRpc().getData();
        console.log(res);
      }),
    );
  }
}
