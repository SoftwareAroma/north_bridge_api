import { ApiProperty } from "@nestjs/swagger";

class TransactionDataObject {
    @ApiProperty()
    authorization_url: string;
    @ApiProperty()
    access_code: string;
    @ApiProperty()
    reference: string;
}
export class TransactionResponse {
    @ApiProperty()
    status: boolean;
    @ApiProperty()
    message: string;
    @ApiProperty({ type: TransactionDataObject })
    data: TransactionDataObject;
}


class HistoryObject {
    @ApiProperty()
    type: string;
    @ApiProperty()
    message: string;
    @ApiProperty()
    time: number;
}

class LogObject {
    @ApiProperty()
    start_time: number;
    @ApiProperty()
    time_spent: number;
    @ApiProperty()
    attempts: number;
    @ApiProperty()
    errors: number;
    @ApiProperty()
    success: true;
    @ApiProperty()
    mobile: false;
    @ApiProperty({ type: [] })
    input: [];
    @ApiProperty({ type: [HistoryObject] })
    history: HistoryObject[]
}

class AuthorizationObject {
    @ApiProperty()
    authorization_code: string;
    @ApiProperty()
    bin: number;
    @ApiProperty()
    last4: number;
    @ApiProperty()
    exp_month: number;
    @ApiProperty()
    exp_year: number;
    @ApiProperty()
    channel: string;
    @ApiProperty()
    card_type: string;
    @ApiProperty()
    bank: string;
    @ApiProperty()
    country_code: string;
    @ApiProperty()
    brand: string;
    @ApiProperty()
    reusable: string;
    @ApiProperty()
    signature: string;
    @ApiProperty()
    account_name: string
}

class CustomerObject {
    @ApiProperty()
    id: number;
    @ApiProperty()
    first_name: string;
    @ApiProperty()
    last_name: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    customer_code: string;
    @ApiProperty()
    phone: string;
    @ApiProperty()
    metadata: string;
    @ApiProperty()
    risk_action: string;
    @ApiProperty()
    international_format_phone: string;
}

class VerifyTransactionDataObject {
    @ApiProperty()
    id: number;
    @ApiProperty()
    domain: string;
    @ApiProperty()
    status: string;
    @ApiProperty()
    reference: string;
    @ApiProperty()
    amount: number;
    @ApiProperty()
    message: String;
    @ApiProperty()
    gateway_response: String;
    @ApiProperty()
    paid_at: string;
    @ApiProperty()
    created_at: string;
    @ApiProperty()
    channel: string;
    @ApiProperty()
    currency: string;
    @ApiProperty()
    ip_address: string;
    @ApiProperty()
    metadata: string;
    @ApiProperty({ type: LogObject })
    log: LogObject;
    @ApiProperty()
    fees: number;
    @ApiProperty()
    fees_split: object;
    @ApiProperty({ type: AuthorizationObject })
    authorization: AuthorizationObject;
    @ApiProperty({ type: CustomerObject })
    customer: CustomerObject;
    @ApiProperty()
    plan: string;
    @ApiProperty()
    split: object;
    @ApiProperty()
    order_id: string;
    @ApiProperty()
    paidAt: string;
    @ApiProperty()
    createdAt: string;
    @ApiProperty()
    requested_amount: number;
    @ApiProperty()
    pos_transaction_data: object;
    @ApiProperty()
    source: string;
    @ApiProperty()
    fees_breakdown: object;
    @ApiProperty()
    transaction_date: string;
    @ApiProperty()
    plan_object: object;
    @ApiProperty()
    subaccount: object;
}


export class VerifyTransactionRespnse {
    @ApiProperty()
    status: boolean;
    @ApiProperty()
    message: string;
    @ApiProperty()
    data: VerifyTransactionDataObject;
}