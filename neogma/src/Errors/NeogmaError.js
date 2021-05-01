/** The base error which is thrown in neogma. All other errors entend this. */
export class NeogmaError extends Error {
    constructor(message, data) {
        super(message);
        this.message = message || 'General neogma error';
        this.data = data || {};
        Object.setPrototypeOf(this, NeogmaError.prototype);
    }
}
//# sourceMappingURL=NeogmaError.js.map