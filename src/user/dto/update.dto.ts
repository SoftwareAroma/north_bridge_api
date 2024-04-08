import { PartialType } from "@nestjs/swagger";
import {
    CreateCartDto,
    CreateUserDto,
    CreateOrderDto,
    CreateOrderItemDto
} from "./create.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) { }

export class UpdateCartDto extends PartialType(CreateCartDto) { }

export class UpdateOrderDto extends PartialType(CreateOrderDto) { }

export class UpdateOrderItemDto extends PartialType(CreateOrderItemDto) { }
