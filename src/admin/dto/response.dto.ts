import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";

// Response Objects
class AdminResponseObject {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    userName: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    otherName: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    isEmailVerified: boolean;

    @ApiProperty()
    role: Role;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

class DataRes {
    @ApiProperty({ type: AdminResponseObject })
    admin: AdminResponseObject;
}

export class AdminResponse {
    // a json objec that uses the CustomApiResponse class
    @ApiProperty()
    data: DataRes;

    @ApiProperty()
    message: string;

    @ApiProperty()
    success: boolean;
}

class DataRes2 {
    @ApiProperty({ type: [AdminResponseObject] })
    admins: [AdminResponseObject];
}

export class AdminsResponse {
    // a json objec that uses the CustomApiResponse class
    @ApiProperty()
    data: DataRes2;

    @ApiProperty()
    message: string;

    @ApiProperty()
    success: boolean;
}
