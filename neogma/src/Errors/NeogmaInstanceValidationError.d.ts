/// <reference types="revalidator" />
import { NeogmaModel } from '../ModelOps';
import { NeogmaError } from './NeogmaError';
/** Error from validating an instance */
export declare class NeogmaInstanceValidationError extends NeogmaError {
    message: NeogmaError['message'];
    data: {
        model: NeogmaModel<any, any, any, any>;
        errors: Revalidator.IErrrorProperty[];
    };
    constructor(message: NeogmaInstanceValidationError['message'], data: NeogmaInstanceValidationError['data']);
}
