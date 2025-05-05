import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role, User, UserStatus } from '@prisma/client';
import { UserService } from '../user.service';
import { UserIdentity } from 'src/common/decorators/user.decorator';
import { FilterUsersDto } from '../dto/filter-users.dto';
import { buildPaginationOptions } from 'src/common/utils';

@Roles(Role.ADMIN)
@Controller('admin/user')
export class UserAdminController {
  constructor(private readonly userService: UserService) {}

  @Get('pending-users')
  getPendingUsers(@Query() { page, limit }: FilterUsersDto) {
    const paginationOptions = buildPaginationOptions({ page, limit });
    return this.userService.getPendingUsers(paginationOptions, { page, limit });
  }

  @Get('')
  getAllUsers(@Query() filterUsersDto: FilterUsersDto) {
    const paginationOptions = buildPaginationOptions(filterUsersDto);
    return this.userService.getAllUser(paginationOptions, filterUsersDto);
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

  @Patch(':id/deactivate-user')
  disActivateUser(
    @Param('id', ParseIntPipe) id: number,
    @UserIdentity() admin: User,
  ) {
    return this.userService.disActivateUser(admin, id);
  }
}
