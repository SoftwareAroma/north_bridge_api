import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";


export class VendorResponseObject {

    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

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
    salt: string;

    @ApiProperty({ default: Role.VENDOR })
    role: Role;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

class DataRes {
    @ApiProperty({ type: VendorResponseObject })
    vendor: VendorResponseObject;
}


export class VendorResponse {
    // a json objec that uses the CustomApiResponse class
    @ApiProperty()
    data: DataRes;

    @ApiProperty()
    message: string;

    @ApiProperty()
    success: boolean;
}

class DataRes2 {
    @ApiProperty({ type: [VendorResponseObject] })
    vendors: [VendorResponseObject];
}

export class VendorsResponse {
    // a json objec that uses the CustomApiResponse class
    @ApiProperty()
    data: DataRes2;

    @ApiProperty()
    message: string;

    @ApiProperty()
    success: boolean;
}
