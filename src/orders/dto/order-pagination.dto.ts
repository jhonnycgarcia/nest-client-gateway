import { IsOptional, IsEnum } from "class-validator";
import { PaginationDto } from "src/common";
import { OrderStatus, OrderStatusList } from "../enum/order.enum";

export class OrderPaginationDto extends PaginationDto {
    @IsOptional()
    @IsEnum(OrderStatusList, {
        message: `Status must be one of the following: ${OrderStatusList.join(', ')}`,
    })
    status?: OrderStatus;
}