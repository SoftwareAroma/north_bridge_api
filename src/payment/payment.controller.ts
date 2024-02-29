import { Body, Controller, Get, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, VerifyPaymentDto } from './dto/create.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@shared/guard';
import { TransactionResponse, VerifyTransactionRespnse } from './dto/response.dto';
import { CustomApiResponse } from '@shared/utils';

@Controller({ path: 'payment', version: '1' })
@ApiTags('Payment Endpoints')
export class PaymentController {
    constructor(
        private readonly paymentService: PaymentService,
    ) { }

    // @UseGuards(JwtAuthGuard)
    @Post('initialize')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'initialize payment',
        type: TransactionResponse,
    })
    async createPayment(
        @Body() body: CreatePaymentDto,
    ): Promise<CustomApiResponse<{ payload: any }>> {
        const response = await this.paymentService.createPayment(body);
        return new CustomApiResponse<{ payload: any }>({
            data: { payload: response },
            message: 'Payment initialized successfully',
            success: true,
        });
    }

    // @UseGuards(JwtAuthGuard)
    @Post('verify')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Verify payment',
        type: VerifyTransactionRespnse,
    })
    async verifyPayment(
        @Body() body: VerifyPaymentDto,
    ): Promise<CustomApiResponse<{ payload: any }>> {
        const response = await this.paymentService.verifyPayment(body.reference);
        return new CustomApiResponse<{ payload: any }>({
            data: { payload: response },
            message: 'Payment Verified successfully',
            success: true,
        });
    }

    // @UseGuards(JwtAuthGuard)
    @Get('transactions')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get all transactions',
        type: VerifyTransactionRespnse,
        isArray: true,
    })
    async getTransactions(): Promise<CustomApiResponse<{ transactions: any }>> {
        const response = await this.paymentService.transactions();
        return new CustomApiResponse<{ transactions: any }>({
            data: { transactions: response },
            message: 'Payment Transactions Fetched successfully',
            success: true,
        });
    }

}
