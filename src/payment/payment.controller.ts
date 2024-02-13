import { Body, Controller, Get, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@shared/guard';
import { TransactionResponse, VerifyTransactionRespnse } from './dto/response.dto';

@Controller('payment')
@ApiTags('Payment Endpoints')
export class PaymentController {
    constructor(
        private readonly paymentService: PaymentService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('initialize')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'initialize payment',
        type: TransactionResponse,
    })
    async createPayment(
        @Body() body: CreatePaymentDto,
    ): Promise<any> {
        return this.paymentService.createPayment(body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('verify')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Verify payment',
        type: VerifyTransactionRespnse,
    })
    async verifyPayment(
        @Body() body: { reference: string },
    ): Promise<any> {
        return this.paymentService.verifyPayment(body.reference);
    }

    @UseGuards(JwtAuthGuard)
    @Get('transactions')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get all transactions',
        type: VerifyTransactionRespnse,
        isArray: true,
    })
    async getTransactions(): Promise<any> {
        return this.paymentService.transactions();
    }

}
