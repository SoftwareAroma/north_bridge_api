import { PartialType } from "@nestjs/swagger";
import { CreateStoreCategoryDto, CreateStoreDto } from "./create.dto";

export class UpdateStoreDto extends PartialType(CreateStoreDto) { }

export class UpdateStoreCategoryDto extends PartialType(CreateStoreCategoryDto) { }