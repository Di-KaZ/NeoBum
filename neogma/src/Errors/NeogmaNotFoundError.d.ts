import { NeogmaError } from './NeogmaError';
/** General constraint error */
export declare class NeogmaNotFoundError extends NeogmaError {
    message: NeogmaError['message'];
    data: Record<string, any>;
    constructor(message: NeogmaNotFoundError['message'], data?: NeogmaNotFoundError['data']);
}
