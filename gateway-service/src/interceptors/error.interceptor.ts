import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
  ForbiddenException,
  HttpException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class CustomErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        console.log(err);
        if (err instanceof HttpException) {
          return throwError(() => err);
        }
        if (err.message && err.message === 'Forbidden resource') {
          return throwError(() => new ForbiddenException());
        }
        if (err.message && err.statusCode) {
          return throwError(
            () => new HttpException(err.message, err.statusCode),
          );
        }
        return throwError(() => new HttpException(err.message, 500));
      }),
    );
  }
}
