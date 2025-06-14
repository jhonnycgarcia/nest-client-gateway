import { Body, Controller, Get, Inject, Logger, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { LoginUserDto, RegisterUserDto } from './dto';
import { catchError } from 'rxjs';

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
  @Get('verify')
  verifyUser(@Query() verifyUserDto: any) {
    return this.client.send('auth.verify.user', verifyUserDto)
      .pipe(
        catchError((error) => {
          this.logger.error(error.message);
          throw new RpcException(error);
        })
      );
  }

}
