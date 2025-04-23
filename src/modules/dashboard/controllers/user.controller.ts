import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UserService } from '../services';

@Roles(Role.ADMIN)
@Controller('dashboard/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createDashboardDto) {
    // return this.dashboardService.create(createDashboardDto);
  }

  @Get('pending')
  findAll() {
    // return this.dashboardService.findAll();
    return this.userService.getPendingUsers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // return this.dashboardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDashboardDto) {
    // return this.dashboardService.update(+id, updateDashboardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return this.dashboardService.remove(+id);
  }
}
