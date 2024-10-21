import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../database/prisma.service';
import {  User } from '@prisma/client';
import { hash } from 'bcrypt';
import { SignupDto } from '../auth/dto/signup.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(userData: SignupDto): Promise<User> {
    const { tagId, ...rest } = userData;

    const [tag, userExists] = await this.prisma.$transaction([
      this.prisma.tag.findUnique({ where: { id: tagId } }),
      this.prisma.user.findUnique({ where: { username: userData.username } }),
    ]);

    if (!tag) throw new NotFoundException('tag not found');
    if (userData.currentYear > tag.yearsNum)
      throw new BadRequestException(
        'current year not valid for this college and major',
      );

    if (userExists) throw new BadRequestException('User already exists');
    rest.password = await hash(rest.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...rest,
        tag: {
          connect: { id: tagId },
        },
      },
    });
    return user;
  }

  async findOneById(id: number): Promise<User> {
    return await this.prisma.user.findUnique({ where: { id } });
  }
  async findOneByIdAndThrow(id: number): Promise<User | HttpException> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    console.log('user in findOne in userService', user);
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  async findOneByUsername(username: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { username } });
  }

  async findOneByUsernameAndThrow(
    username: string,
  ): Promise<User | HttpException> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
