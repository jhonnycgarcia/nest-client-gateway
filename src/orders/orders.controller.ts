import { Controller, Get, Post, Body, Param, Logger, Inject, ParseUUIDPipe, Query, Patch } from '@nestjs/common';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ORDERS_SERVICE } from 'src/config';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {

  private readonly logger = new Logger('OrdersController');

  constructor(
    @Inject(ORDERS_SERVICE) private readonly ordersClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder', createOrderDto)
      .pipe(
        catchError((error) => {
          this.logger.error(error.message);
          throw new RpcException(error);
        })
      );
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.ordersClient.send('findAllOrders', orderPaginationDto)
      .pipe(
        catchError((error) => {
          this.logger.error(error.message);
          throw new RpcException(error);
        })
      );
  }

  @Get('id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersClient.send('findOneOrder', {id})
      .pipe(
        catchError((error) => {
          this.logger.error(error.message);
          throw new RpcException(error);
        })
      );
  }

  @Get(':status')
  findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    const { status } = statusDto;
    return this.ordersClient.send('findAllOrders', {
      ...paginationDto,
      status,
    })
      .pipe(
        catchError((error) => {
          this.logger.error(error.message);
          throw new RpcException(error);
        })
      );
  }

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto
  ) {
    const { status } = statusDto;
    return this.ordersClient.send('changeOrderStatus', {id, status})
      .pipe(
        catchError((error) => {
          this.logger.error(error.message);
          throw new RpcException(error);
        })
      );
  }
}
