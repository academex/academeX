import { CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../constants';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { config } from 'dotenv';
import { UserService } from 'src/modules/user/user.service';
import { Role, UserStatus } from '../enums';
config();

export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getClass(), context.getHandler()],
      );

      if (isPublic) return true;

      const request = context.switchToHttp().getRequest();
      const token = this.extractToken(request);

      const { username } = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      //finding the user , and didn't store teh user in the token
      // to get the lastest user info (because maybe the user's info got updated)
      // const { password, ...user } = await this.userService.findOne(username);
      // if (
      //   !user ||
      //   (user.status != UserStatus.ACTIVE &&
      //     user.roles != Role.ADMIN &&
      //     request.path != '/auth/verify')
      // )
      //   return false;
      // if (!user) return false;
      // request['user'] = user;
      return true;
    } catch (err) {
      return false;
    }
  }

  private extractToken(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ');
    return type == 'Bearer' ? token : undefined;
  }
}
