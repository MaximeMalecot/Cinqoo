import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello() {
    return this.getUsers();
  }

  async getUsers() {
    return await this.prisma.user.findMany();
  }
}
