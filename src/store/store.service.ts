import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma/prisma.service';

@Injectable()
export class StoreService {

    constructor(
        private prismaService: PrismaService,
    ) { }

}
