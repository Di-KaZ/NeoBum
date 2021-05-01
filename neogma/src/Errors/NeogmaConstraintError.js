"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeogmaConstraintError = void 0;
const NeogmaError_1 = require("./NeogmaError");
/** General constraint error */
class NeogmaConstraintError extends NeogmaError_1.NeogmaError {
    constructor(message, data) {
        super(message, data);
        this.message = message || 'neogma constraint error';
        this.data = data || {};
        Object.setPrototypeOf(this, NeogmaConstraintError.prototype);
    }
}
exports.NeogmaConstraintError = NeogmaConstraintError;
//# sourceMappingURL=NeogmaConstraintError.js.map