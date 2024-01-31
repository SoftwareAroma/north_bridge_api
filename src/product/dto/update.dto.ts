import { PartialType } from "@nestjs/swagger";
import { CreateProductCategoryDto, CreateProductDto } from "./create.dto";

export class UpdateProductDto extends PartialType(CreateProductDto) { }
export class UpdateProductCategoryDto extends PartialType(CreateProductCategoryDto) { }
