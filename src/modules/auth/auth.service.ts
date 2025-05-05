import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { compare } from 'bcrypt';
import { Prisma } from '@prisma/client';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private userService: UserService,
    private JwtService: JwtService,
  ) {}

  async signin({ username, password }: SigninDto) {
    // note: username mayb_e email or username.
    const { password: userPassword, ...user } =
      await this.userService.findOneByUsernameOrEmailWithPass(username);

    if (!user) throw new UnauthorizedException('wrong username or password');

    const isPasswordCorrect = await compare(password, userPassword);
    if (!isPasswordCorrect)
      throw new UnauthorizedException('wrong username or password');

    return {
      user,
      accessToken: this.JwtService.sign({ username }),
    };
  }

  async signup(signupDto: SignupDto) {
    const user = await this.userService.create(signupDto);
    return {
      user,
      accessToken: this.JwtService.sign({ username: user.username }),
    };
  }
}
