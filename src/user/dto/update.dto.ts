import { PartialType } from "@nestjs/swagger";
import { CreateCartDto, CreateUserDto } from "./create.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) { }

export class UpdateCartDto extends PartialType(CreateCartDto) { }