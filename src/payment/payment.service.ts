import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create.dto';
import { PAY_STACK_API_KEY } from '@shared/environment';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class PaymentService {
    constructor(
        private readonly httpService: HttpService,
    ) { }

    /**
     * Create payment (initialize)
     * @param dataDto [CreatePaymentDto]
     * @returns Object from paystack
     */
    async createPayment(dataDto: CreatePaymentDto) {
        const { amount, currency, email } = dataDto;

        const params = JSON.stringify({
            "email": email,
            "amount": amount * 100,
            "currency": currency,
        })

        const headers = {
            Authorization: `Bearer ${PAY_STACK_API_KEY}`,
            'Content-Type': 'application/json'
        }

        const { data } = await firstValueFrom(
            this.httpService.post('https://api.paystack.co/transaction/initialize', params, {
                headers: headers
            }).pipe(
                catchError((error: AxiosError) => {
                    // this.logger.error(error.response.data);
                    console.log(error.response.data);
                    throw new HttpException(error.response.data ?? "An Error Occured", HttpStatus.BAD_REQUEST);
                }),
            ),
        );
        return data;
    }


    /**
     * Verify payment
     * @param reference The transaction reference
     * @returns response from paystack [Object]
     */
    async verifyPayment(reference: string) {
        const headers = {
            Authorization: `Bearer ${PAY_STACK_API_KEY}`,
            'Content-Type': 'application/json'
        }

        const { data } = await firstValueFrom(
            this.httpService.get(
                `https://api.paystack.co/transaction/verify/${reference}`, {
                headers: headers
            }).pipe(
                catchError((error: AxiosError) => {
                    // this.logger.error(error.response.data);
                    console.log(error.response.data);
                    throw new HttpException(error.response.data ?? "An Error Occured", HttpStatus.BAD_REQUEST);
                }),
            ),
        );
        return data;
    }

    /**
     * Get all transactions
     * @returns response from paystack [Object]
     */
    async transactions() {
        const headers = {
            Authorization: `Bearer ${PAY_STACK_API_KEY}`,
            'Content-Type': 'application/json'
        };

        const { data } = await firstValueFrom(
            this.httpService.get(
                `https://api.paystack.co/transaction`, {
                headers: headers
            }).pipe(
                catchError((error: AxiosError) => {
                    // this.logger.error(error.response.data);
                    console.log(error.response.data);
                    throw new HttpException(error.response.data ?? "An Error Occured", HttpStatus.BAD_REQUEST);
                }),
            ),
        );
        return data;
    }
}
