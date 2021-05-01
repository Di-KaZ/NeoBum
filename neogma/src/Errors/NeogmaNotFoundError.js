"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeogmaNotFoundError = void 0;
const NeogmaError_1 = require("./NeogmaError");
/** General constraint error */
class NeogmaNotFoundError extends NeogmaError_1.NeogmaError {
    constructor(message, data) {
        super(message, data);
        this.message = message || 'neogma not found error';
        this.data = data || {};
        Object.setPrototypeOf(this, NeogmaNotFoundError.prototype);
    }
}
exports.NeogmaNotFoundError = NeogmaNotFoundError;
//# sourceMappingURL=NeogmaNotFoundError.js.map