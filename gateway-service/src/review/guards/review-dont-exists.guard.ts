import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ReviewDontExistsGuard implements CanActivate {
  constructor(
    @Inject('REVIEW_SERVICE')
    private readonly reviewService: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { prestationId } = req.params;
    const reviewExists = await firstValueFrom(
      this.reviewService.send('REVIEW.EXISTS', {
        userId: req.user._id,
        prestationId,
      }),
    );
    return !reviewExists;
  }
}
