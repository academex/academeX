import {
  BadRequestException,
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
import { OptionalAuth } from 'src/common/decorators/optional-auth.decorator';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { UserService } from '../user.service';
import { UpdatePassword } from '../dto/update-password.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @OptionalAuth()
  @Get(':username')
  getUser(@Param('username') username: string, @UserIdentity() user: User) {
    return this.userService.profile(username, user);
  }

  @Put('update')
  @UseInterceptors(
    FileInterceptor('photoUrl', {
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(
            new BadRequestException(
              'Invalid file type. Only JPG, PNG, and jpeg are allowed.',
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  updateUser(
    @UserIdentity() user: User,
    @UploadedFile() photoUrl: Express.Multer.File,
    @Body() data: UpdateUserDto,
  ) {
    return this.userService.updateUser(user, data, photoUrl);
  }

  @Put('update-password')
  updatePassword(@UserIdentity() user: User, @Body() data: UpdatePassword) {
    return this.userService.updatePassword(user, data);
  }
}
