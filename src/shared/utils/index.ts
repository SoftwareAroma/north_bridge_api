export class CustomApiResponse<T> {
    data: T;
    message: string;
    success: boolean;

    constructor({ data, message, success }: { data: T; message: string; success: boolean }) {
        this.data = data;
        this.message = message;
        this.success = success;
    }
}