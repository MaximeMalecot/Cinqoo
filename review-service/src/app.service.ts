import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Review service!';
  }

  async countReviews(): Promise<number | null> {
    return await this.prisma.review.count();
  }
}
