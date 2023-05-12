import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHello(): Promise<string> {
    const count = await this.prisma.prestation.count();
    return `Prestation service, there are currently ${count} prestations in the database`;
  }
}
