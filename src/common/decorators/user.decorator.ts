import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const UserIdentity = createParamDecorator(
  (data, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user
);
