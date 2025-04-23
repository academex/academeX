import { BadRequestException, Injectable } from '@nestjs/common';
import { User, UserStatus } from '@prisma/client';
import { UserSelect } from 'src/common/prisma/selects';
import { PrismaService } from 'src/modules/database/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  create(createDashboardDto) {
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
  // todo: inactive must upload a photo to update his status to pending (requested to review)

  // todo: pagination
  async getPendingUsers() {
    const users = await this.prisma.user.findMany({
      where: { status: UserStatus.PENDING },
      select: UserSelect,
      orderBy: { createdAt: 'desc' },
    });
    return users;
  }

  async getAllUser() {
    return await this.prisma.user.findMany({
      select: UserSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateUserStatus(admin: User, userId: number, status: UserStatus) {
    // check if the user is exists and his status is pending (is a must)
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId, status: UserStatus.PENDING },
    });

    if (!userExists)
      throw new BadRequestException('not user found with this data');

    // update the user status and statusUpdatedBy
    return await this.prisma.user.update({
      where: { id: userId },
      data: { status, statusUpdatedBy: admin.username },
      select: UserSelect,
    });
  }
}
