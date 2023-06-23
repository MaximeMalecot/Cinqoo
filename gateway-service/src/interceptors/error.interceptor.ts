import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class CustomErrorInterceptor implements NestInterceptor {
  private readonly logger: Logger = new Logger();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        this.logger.error(err.message, err, context.getClass().name);

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
