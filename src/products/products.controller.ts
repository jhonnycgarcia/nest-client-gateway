import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PRODUCTS_SERVICE } from 'src/config';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCTS_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  createProduct() {
    return 'Product created';
  }

  @Get()
  findAllProducts() {
    return this.productsClient.send({ cmd: 'find_all_products' }, {});
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return `Get product ${id}`;
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
