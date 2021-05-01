import { NeogmaError } from './NeogmaError';
/** General constraint error */
export class NeogmaNotFoundError extends NeogmaError {
    constructor(message, data) {
        super(message, data);
        this.message = message || 'neogma not found error';
        this.data = data || {};
        Object.setPrototypeOf(this, NeogmaNotFoundError.prototype);
    }
}
//# sourceMappingURL=NeogmaNotFoundError.js.map