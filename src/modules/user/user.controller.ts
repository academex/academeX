import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserIdentity } from 'src/common/decorators/user.decorator';
import { UserService } from './user.service';
import { OptionalAuth } from 'src/common/decorators/optional-auth.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @OptionalAuth()
  @Get(':username')
  getUser(@Param('username') username: string, @UserIdentity() user: User) {
    return this.userService.profile(username, user);
  }

  @Put('update')
  updateUser(@UserIdentity() user: User, @Body() data: UpdateUserDto) {
    return this.userService.updateUser(user, data);
  }
}
