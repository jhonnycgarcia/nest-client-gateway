import { Catch, ArgumentsHost, HttpStatus, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
    catch(
        exception: RpcException,
        host: ArgumentsHost
    ) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        const error = exception.getError();

        if(error.toString().includes('Empty response')) {
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: error.toString()
                        .substring(
                            0,
                            error.toString().indexOf('(') - 1
                        ),
                });
        }

        if(
            typeof error === 'object' 
            && 'status' in error 
            && 'message' in error
        ) {
            const status = isNaN((error.status as unknown as number)) 
                ? HttpStatus.BAD_REQUEST 
                : (error.status as unknown as number);
            return response.status(status).json(error);
        }

        response.status(HttpStatus.BAD_REQUEST).json(error);
    }
}
