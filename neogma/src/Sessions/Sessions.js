var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const isTransaction = (tx) => { var _a; return typeof ((_a = tx === null || tx === void 0 ? void 0 : tx.isOpen) === null || _a === void 0 ? void 0 : _a.call(tx)) === 'boolean'; };
/** runs the callback with a session. It closes it when the callback is done */
export const getSession = (
/** an existing session to use. If a session is given, it'll be used as is */
runInSession, callback, driver) => __awaiter(void 0, void 0, void 0, function* () {
    if (runInSession) {
        return callback(runInSession);
    }
    const session = driver.session();
    try {
        const result = yield callback(session);
        yield session.close();
        return result;
    }
    catch (err) {
        yield session.close();
        throw err;
    }
});
/** runs the callback with a transaction. It closes it if the callback is successful, and rolls it back if not */
export const getTransaction = (
/** an existing transaction or session to use. If a transaction is given, it'll be used as is. If a session is given, it'll be used for creating the transaction */
runInExisting, callback, driver) => __awaiter(void 0, void 0, void 0, function* () {
    // if it's a transaction, return it with the callback
    if (isTransaction(runInExisting)) {
        return callback(runInExisting);
    }
    // else get a session (using the runInExisting session if it's passed)
    return getSession(runInExisting, (session) => __awaiter(void 0, void 0, void 0, function* () {
        const transaction = session.beginTransaction();
        try {
            const result = yield callback(transaction);
            yield transaction.commit();
            return result;
        }
        catch (err) {
            yield transaction.rollback();
            throw err;
        }
    }), driver);
});
/** runs the callback with a session or transaction. If any existing Runnable is given, it gets used. Else, a new Session is used */
export const getRunnable = (runInExisting, callback, driver) => __awaiter(void 0, void 0, void 0, function* () {
    if (runInExisting) {
        return callback(runInExisting);
    }
    return getSession(null, callback, driver);
});
//# sourceMappingURL=Sessions.js.map