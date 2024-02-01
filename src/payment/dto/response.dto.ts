import { ApiProperty } from "@nestjs/swagger";

export class TransactionResponse {
    @ApiProperty()
    status: boolean;
    @ApiProperty()
    message: string;
    @ApiProperty()
    data: {
        authorization_url: string,
        access_code: string,
        reference: string
    }
}

export class VerifyTransactionRespnse {
    @ApiProperty()
    status: boolean;
    @ApiProperty()
    message: string;
    @ApiProperty()
    data: {
        id: number,
        domain: string,
        status: string,
        reference: string,
        amount: number,
        message: String,
        gateway_response: String,
        paid_at: string,
        created_at: string,
        channel: string,
        currency: string,
        ip_address: string,
        metadata: string,
        log: {
            start_time: number,
            time_spent: number,
            attempts: number,
            errors: number,
            success: true,
            mobile: false,
            input: [],
            history: [
                {
                    type: string,
                    message: string,
                    time: number
                },
                {
                    type: string,
                    message: string,
                    time: number
                }
            ]
        },
        fees: number,
        fees_split: any,
        authorization: {
            authorization_code: string,
            bin: number,
            last4: number,
            exp_month: number,
            exp_year: number,
            channel: string,
            card_type: string,
            bank: string,
            country_code: string,
            brand: string,
            reusable: string,
            signature: string,
            account_name: any
        },
        customer: {
            id: number,
            first_name: any,
            last_name: any,
            email: string,
            customer_code: string,
            phone: any,
            metadata: any,
            risk_action: string,
            international_format_phone: any
        },
        plan: any,
        split: {},
        order_id: any,
        paidAt: string,
        createdAt: string,
        requested_amount: number,
        pos_transaction_data: any,
        source: any,
        fees_breakdown: any,
        transaction_date: string,
        plan_object: object,
        subaccount: object,
    }
}