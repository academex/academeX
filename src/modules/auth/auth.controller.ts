import { Controller, Post, Body } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/access.decorator';
import { CreateUserDto } from 'src/common/dtos/create-user.dto';
import { UserIdentity } from 'src/common/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }
  
  // @Post('verify')
  // async verifyUser(@Body() { otp }: VerifyUserDto, @UserIdentity() user: IUser) {
  //   return await this.authService.verifyUser(user.id, otp);
  // }
}
