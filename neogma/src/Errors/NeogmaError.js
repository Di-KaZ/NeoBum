"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeogmaError = void 0;
/** The base error which is thrown in neogma. All other errors entend this. */
class NeogmaError extends Error {
    constructor(message, data) {
        super(message);
        this.message = message || 'General neogma error';
        this.data = data || {};
        Object.setPrototypeOf(this, NeogmaError.prototype);
    }
}
exports.NeogmaError = NeogmaError;
//# sourceMappingURL=NeogmaError.js.map