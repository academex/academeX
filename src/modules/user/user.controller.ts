import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserIdentity } from 'src/common/decorators/user.decorator';
import { UserService } from './user.service';
import { OptionalAuth } from 'src/common/decorators/optional-auth.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UpdatePassword } from './dto/update-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @OptionalAuth()
  @Get(':username')
  getUser(@Param('username') username: string, @UserIdentity() user: User) {
    return this.userService.profile(username, user);
  }

  @Put('update')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'photoUrl', maxCount: 1 }]))
  updateUser(
    @UserIdentity() user: User,
    @UploadedFile()
    uploads: { photoUrl?: Express.Multer.File[] },
    @Body() data: UpdateUserDto,
  ) {
    console.log('in update with file', uploads);
    return this.userService.updateUser(user, data);
  }

  @Put('update-password')
  updatePassword(@UserIdentity() user: User, @Body() data: UpdatePassword) {
    return this.userService.updatePassword(user, data);
  }
}
