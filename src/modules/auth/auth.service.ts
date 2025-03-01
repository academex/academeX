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
    const userExists = await this.userService.findOneByUsername(username);

    if (!userExists)
      throw new UnauthorizedException('wrong username or password');

    const isPasswordCorrect = await compare(password, userExists.password);
    if (!isPasswordCorrect)
      throw new UnauthorizedException('wrong username or password');
    const {
      password: userPassword,
      resetPasswordToken,
      resetPasswordTokenExpires,
      ...user
    } = userExists;

    return {
      user,
      accessToken: this.JwtService.sign({ username }),
    };
  }

  async signup(signupDto: SignupDto) {
    const { password, resetPasswordToken, resetPasswordTokenExpires, ...user } =
      await this.userService.create(signupDto);
    return {
      user,
      accessToken: this.JwtService.sign({ username: user.username }),
    };
  }
}
