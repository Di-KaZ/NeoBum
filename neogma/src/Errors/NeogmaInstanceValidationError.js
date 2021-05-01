import { NeogmaError } from './NeogmaError';
/** Error from validating an instance */
export class NeogmaInstanceValidationError extends NeogmaError {
    constructor(message, data) {
        super(message, data);
        this.message = message || 'neogma validation error';
        this.data = data;
        Object.setPrototypeOf(this, NeogmaInstanceValidationError.prototype);
    }
}
//# sourceMappingURL=NeogmaInstanceValidationError.js.map