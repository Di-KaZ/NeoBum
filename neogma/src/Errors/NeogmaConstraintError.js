import { NeogmaError } from './NeogmaError';
/** General constraint error */
export class NeogmaConstraintError extends NeogmaError {
    constructor(message, data) {
        super(message, data);
        this.message = message || 'neogma constraint error';
        this.data = data || {};
        Object.setPrototypeOf(this, NeogmaConstraintError.prototype);
    }
}
//# sourceMappingURL=NeogmaConstraintError.js.map