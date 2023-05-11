import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHello(): Promise<string> {
    const count = await this.prisma.review.count();
    return `Review service! There are currently ${count} reviews in the database`;
  }
}
