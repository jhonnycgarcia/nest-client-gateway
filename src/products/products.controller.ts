import { BadRequestException, Body, Controller, Delete, Get, Inject, InternalServerErrorException, Logger, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { PRODUCTS_SERVICE } from 'src/config';

@Controller('products')
export class ProductsController {
  private readonly logger = new Logger('ProductsController');
  constructor(
    @Inject(PRODUCTS_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  createProduct() {
    return 'Product created';
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.productsClient.send({ cmd: 'find_all_products' }, paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const product = await firstValueFrom(
        this.productsClient.send({ cmd: 'find_one_product' }, { id })
      );
      
      return product;
      
    } catch (error) {
      this.logger.error(error.message);
      // throw new BadRequestException(error);
      throw new RpcException(error);
    }

    return this.productsClient.send({ cmd: 'find_one_product' }, { id })
      .pipe(
        catchError((error) => {
          this.logger.error(error.message);
          throw new RpcException(error);
        })
      );
  }

  @Patch(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    return `Update product ${id} with ${JSON.stringify(body)}`;
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return `Delete product ${id}`;
  }
}
