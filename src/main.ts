import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './modules/user/user.service';
import { AuthGuard } from './common/guards/auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global Guards
  const reflector = app.get(Reflector);
  const jwtService = app.get(JwtService);
  const userService = app.get(UserService);
  app.useGlobalGuards(
    new AuthGuard(reflector, jwtService, userService),
    new RolesGuard(reflector),
  );

  // run app
  await app.listen(3000);
}
bootstrap();
