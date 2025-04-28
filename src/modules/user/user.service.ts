import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../database/prisma.service';
import { User, Tag, UserStatus } from '@prisma/client';
import { hash, compare } from 'bcrypt';
import { SignupDto } from '../auth/dto/signup.dto';
import { UpdatePassword } from './dto/update-password.dto';
import { StorageService } from '../storage/storage.service';
import { UserProfileSelect, UserSelect } from 'src/common/prisma/selects';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  async create(userData: SignupDto) {
    const { tagId, ...rest } = userData;

    const tag = await this.validateTag(tagId);
    this.validateTagCurrentYearAndThrow(tag, userData.currentYear);
    rest.password = await hash(rest.password, 10);

    const user = await this.prisma.user.create({
      select: UserProfileSelect,
      data: {
        ...rest, //
        tag: {
          connect: { id: tagId },
        },
      },
    });
    return user;
  }

  // UpdateUserDto => ensure that the email, username and tagId are valid.
  //todo: remove the old photoUrl for the same user.
  async updateUser(
    user: User,
    data: UpdateUserDto,
    photoUrl?: Express.Multer.File,
  ) {
    const { tagId, currentYear, ...restData } = data;
    let tag: Tag | null = null;
    let userTag = null;

    // hosting photoUrl on supabase.
    if (photoUrl) {
      const photoUrlPath = await this.storageService.uploadImage(photoUrl);
      restData.photoUrl = photoUrlPath.url;
    }

    // Validate new tag if provided
    if (tagId) {
      tag = await this.validateTag(tagId);
      this.validateTagCurrentYearAndThrow(tag, user.currentYear);
    }

    // Fetch user's existing tag only if needed
    if (currentYear || !tag) {
      userTag = await this.prisma.tag.findUnique({
        where: { id: user.tagId },
        select: { yearsNum: true },
      });
    }

    // Validate new currentYear if provided
    if (currentYear) {
      this.validateTagCurrentYearAndThrow(tag || userTag, currentYear);
    }

    const updatedUser = await this.prisma.user.update({
      select: UserProfileSelect,
      where: { id: user.id },
      data: {
        ...restData,
        ...(tagId && {
          tag: {
            connect: { id: tagId },
          },
        }),
        ...(currentYear && {
          currentYear: currentYear,
        }),
      },
    });

    return updatedUser;
  }

  async updatePassword(user: User, data: UpdatePassword) {
    this.logger.log('in update password ');

    const { password, confirmPassword, newPassword } = data;
    if (newPassword !== confirmPassword)
      throw new BadRequestException(
        'password must be the same as the confirm password',
      );

    // check if the password right
    const userData = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: {
        password: true,
      },
    });

    if (!(await compare(password, userData.password)))
      throw new BadRequestException('incorrect password');

    this.logger.log('right password');

    // update the user's password after hashing it.
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: await hash(newPassword, 10),
      },
    });

    this.logger.log(updatedUser);
    // todo: logout of all devices.
    return { message: 'password updated', data: updatedUser };
  }

  async profile(username: string, ReqUser: User) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: UserProfileSelect,
    });

    if (!user) throw new NotFoundException('user not found.');
    return user;
  }

  async findOneByUsernameOrEmail(username: string) {
    return await this.prisma.user.findFirst({
      select: UserProfileSelect,
      where: {
        OR: [{ username: username }, { email: username }],
      },
    });
  }

  async findOneByUsernameOrEmailWithPass(username: string) {
    return await this.prisma.user.findFirst({
      select: { ...UserProfileSelect, password: true },
      where: {
        OR: [{ username: username }, { email: username }],
      },
    });
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

  //! Admin Functions:
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

  async getUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: UserSelect,
    });

    if (!user) throw new NotFoundException('user not found.');
    return user;
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
  async disActivateUser(admin: User, userId: number) {
    // check if the user is exists and his status is pending (is a must)
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists)
      throw new BadRequestException('not user found with this data');

    // update the user status and statusUpdatedBy
    return await this.prisma.user.update({
      where: { id: userId },
      data: { status: UserStatus.INACTIVE, statusUpdatedBy: admin.username },
      select: UserSelect,
    });
  }
}
