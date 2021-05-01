import { NeogmaError } from './NeogmaError';
/** General constraint error */
export declare class NeogmaConstraintError extends NeogmaError {
    message: NeogmaError['message'];
    data: {
        description?: any;
        actual?: any;
        expected?: any;
    };
    constructor(message: NeogmaConstraintError['message'], data?: NeogmaConstraintError['data']);
}
