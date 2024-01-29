import { PartialType } from "@nestjs/swagger";
import { CreateAdminDto } from "./create.dto";

export class UpdateAdminDto extends PartialType(CreateAdminDto) { }
