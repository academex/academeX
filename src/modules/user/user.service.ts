import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../database/prisma.service';
import { User, Tag } from '@prisma/client';
import { hash } from 'bcrypt';
import { SignupDto } from '../auth/dto/signup.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(userData: SignupDto): Promise<User> {
    const { tagId, ...rest } = userData;

    const tag = await this.validateTag(tagId);
    this.validateTagCurrentYearAndThrow(tag, userData.currentYear);
    rest.password = await hash(rest.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...rest,//
        tag: {
          connect: { id: tagId },
        },
      },
    });
    return user;
  }

  // UpdateUserDto => ensure that the email, username and tagId are valid.
  async updateUser(user: User, data: UpdateUserDto): Promise<User> {
    const { tagId, ...restData } = data;
    const tag = await this.validateTag(tagId);
    this.validateTagCurrentYearAndThrow(tag, user.currentYear);

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        ...restData,
        ...(tagId && {
          tag: {
            connect: { id: tagId },
          },
        }),
      },
    });

    return updatedUser;
  }

  async profile(username: string, ReqUser: User) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        bio: true,
        currentYear: true,
        gender: true,
        phoneNum: true,
        photoUrl: true,
        role: true,
        tag: {
          select: {
            name: true,
            collegeAr: true,
            collegeEn: true,
            majorAr: true,
            majorEn: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('user not found.');
    return user;
  }

  async findOneById(id: number): Promise<User> {
    return await this.prisma.user.findUnique({ where: { id } });
  }
  async findOneByIdAndThrow(id: number): Promise<User | HttpException> {
    const user = await this.prisma.user.findUnique({ where: { id } });
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

  async findOneByUsernameOrEmail(
    email: string,
    username: string,
  ): Promise<User> {
    return await this.prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
  }

  findAll() {
    return `This action returns all user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async validateTag(tagId: number): Promise<Tag> {
    const tag = await this.prisma.tag.findUnique({ where: { id: tagId } });
    if (!tag) throw new NotFoundException('tag not found');
    return tag;
  }

  validateTagCurrentYearAndThrow(tag: Tag, currentYear: number) {
    if (currentYear > tag.yearsNum)
      throw new BadRequestException(
        'current year not valid for this college and major',
      );
  }
}
