import { BadRequestException, Injectable } from '@nestjs/common';
import { User, UserStatus } from '@prisma/client';
import { UserSelect } from 'src/common/prisma/selects';
import { PrismaService } from 'src/modules/database/prisma.service';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}
  create() {
    return 'This action adds a new dashboard';
  }

  findAll() {
    return `This action returns all dashboard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dashboard`;
  }

  update(id: number, updateDashboardDto) {
    return `This action updates a #${id} dashboard`;
  }

  remove(id: number) {
    return `This action removes a #${id} dashboard`;
  }
}
