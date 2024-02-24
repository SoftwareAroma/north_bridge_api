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
     * @returns Object from paystack
     * @param dataDto
     */
    async createPayment(dataDto: CreatePaymentDto): Promise<any> {
        try {
            const { amount, currency, email } = dataDto;

            // if either amount, currency or email is null
            if (!amount) {
                throw new HttpException("Amount,is required", HttpStatus.BAD_REQUEST);
            }
            if (!currency) {
                throw new HttpException("Currency is required", HttpStatus.BAD_REQUEST);
            }
            if (!email) {
                throw new HttpException("Email is required", HttpStatus.BAD_REQUEST);
            }

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
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    /**
     * Verify payment
     * @param reference The transaction reference
     * @returns response from paystack [Object]
     */
    async verifyPayment(reference: string): Promise<any> {
        try {// if reference is null
            if (!reference) {
                throw new HttpException("Reference is required", HttpStatus.BAD_REQUEST);
            }
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
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get all transactions
     * @returns response from paystack [Object]
     */
    async transactions(): Promise<any> {
        try {
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
                        throw new HttpException(error.response.data ?? "An Error Occurred", HttpStatus.BAD_REQUEST);
                    }),
                ),
            );
            return data;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
