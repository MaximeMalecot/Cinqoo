import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class StripeSignatureGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const signature = request.headers['stripe-signature'];
    if (!signature) {
      throw new UnauthorizedException(
        'You are not authorized to use this route',
      );
    }

    return true;
  }
}
