"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimWhitespace = void 0;
const trimWhitespace = (s, replaceWith = ' ') => { var _a; return (_a = s.replace(/\s+/g, replaceWith)) === null || _a === void 0 ? void 0 : _a.trim(); };
exports.trimWhitespace = trimWhitespace;
//# sourceMappingURL=string.js.map