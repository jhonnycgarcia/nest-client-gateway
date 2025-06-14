import { Body, Controller, Get, Inject, Logger, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { LoginUserDto, RegisterUserDto } from './dto';
import { catchError } from 'rxjs';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {

  private readonly logger = new Logger(AuthController.name);

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}
  
  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.client.send('auth.register.user', registerUserDto)
      .pipe(
        catchError((error) => {
          this.logger.error(error.message);
          throw new RpcException(error);
        })
      );
  }
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.client.send('auth.login.user', loginUserDto)
      .pipe(
        catchError((error) => {
          this.logger.error(error.message);
          throw new RpcException(error);
        })
      );
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  verifyUser(@Request() req: Request) {
    const user = req['user'];
    const token = req['token'];
    return this.client.send('auth.verify.user', { user, token })
      .pipe(
        catchError((error) => {
          this.logger.error(error.message);
          throw new RpcException(error);
        })
      );
  }

}
