import { Controller, Get, Param } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserIdentity } from 'src/common/decorators/user.decorator';
import { UserService } from './user.service';
import { OptionalAuth } from 'src/common/decorators/optional-auth.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @OptionalAuth()
  @Get(':username')
  getUser(@Param('username') username: string, @UserIdentity() user: User) {
    return this.userService.profile(username, user);
  }
}
