import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role, User, UserStatus } from '@prisma/client';
import { UserService } from '../user.service';
import { UserIdentity } from 'src/common/decorators/user.decorator';

@Roles(Role.ADMIN)
@Controller('dashboard/user')
export class UserAdminController {
  constructor(private readonly userService: UserService) {}
  @Get('pending-users')
  getPendingUsers() {
    return this.userService.getPendingUsers();
  }

  @Get('')
  getAllUsers() {
    return this.userService.getAllUser();
  }

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUser(id);
  }

  @Patch(':id/activate-user')
  activateUser(
    @Param('id', ParseIntPipe) id: number,
    @UserIdentity() admin: User,
  ) {
    return this.userService.updateUserStatus(admin, id, UserStatus.ACTIVE);
  }

  @Patch(':id/reject-user')
  rejectUser(
    @Param('id', ParseIntPipe) id: number,
    @UserIdentity() admin: User,
  ) {
    return this.userService.updateUserStatus(admin, id, UserStatus.REJECTED);
  }

  @Patch(':id/reject-user')
  disActivateUser(
    @Param('id', ParseIntPipe) id: number,
    @UserIdentity() admin: User,
  ) {
    return this.userService.disActivateUser(admin, id);
  }
}
