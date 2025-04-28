import { Controller, Post, Body } from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/access.decorator';
import { UserIdentity } from 'src/common/decorators/user.decorator';
import { Prisma } from '@prisma/client';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signin')
  async signin(@Body() signinDto: SigninDto) {
    return await this.authService.signin(signinDto);
  }

  @Public()
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return await this.authService.signup(signupDto);
  }
}
