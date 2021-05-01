"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeogmaInstanceValidationError = void 0;
const NeogmaError_1 = require("./NeogmaError");
/** Error from validating an instance */
class NeogmaInstanceValidationError extends NeogmaError_1.NeogmaError {
    constructor(message, data) {
        super(message, data);
        this.message = message || 'neogma validation error';
        this.data = data;
        Object.setPrototypeOf(this, NeogmaInstanceValidationError.prototype);
    }
}
exports.NeogmaInstanceValidationError = NeogmaInstanceValidationError;
//# sourceMappingURL=NeogmaInstanceValidationError.js.map