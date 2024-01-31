import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create.dto';
import { ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@shared/guard';

@Controller('payment')
export class PaymentController {
    constructor(
        private readonly paymentService: PaymentService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('initialize')
    @ApiResponse({
        status: 200,
        description: 'Get all transactions',
        type: Object,
    })
    async createPayment(
        @Body() body: CreatePaymentDto,
    ) {
        return this.paymentService.createPayment(body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('verify')
    @ApiResponse({
        status: 200,
        description: 'Get all transactions',
        type: Object,
    })
    async verifyPayment(
        @Body() body: { reference: string },
    ) {
        return this.paymentService.verifyPayment(body.reference);
    }

    @UseGuards(JwtAuthGuard)
    @Get('transactions')
    @ApiResponse({
        status: 200,
        description: 'Get all transactions',
        type: Object,
    })
    async getTransactions() {
        return this.paymentService.transactions();
    }

}
