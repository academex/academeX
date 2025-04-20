import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY, OPTIONAL_AUTH_KEY } from '../constants';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { config } from 'dotenv';
import { UserService } from 'src/modules/user/user.service';
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

      const OptionalAuth = this.reflector.getAllAndOverride<boolean>(
        OPTIONAL_AUTH_KEY,
        [context.getClass(), context.getHandler()],
      );

      const request = context.switchToHttp().getRequest();
      const token = this.extractToken(request);

      if (OptionalAuth && !token) {
        request['user'] = undefined;
        return true;
      }

      const { username } = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const {
        password,
        resetPasswordToken,
        resetPasswordTokenExpires,
        ...user
      } = await this.userService.findOneByUsername(username);
      if (!user) return false;
      request['user'] = user;
      return true;
    } catch (err) {
      return false;
    }
  }

  private extractToken(req: Request): string | undefined {
    if (!req.headers.authorization) return undefined;
    const [type, token] = req.headers.authorization?.split(' ');
    return type == 'Bearer' ? token : undefined;
  }
}
