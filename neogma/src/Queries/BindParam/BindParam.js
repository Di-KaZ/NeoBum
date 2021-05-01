"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BindParam = void 0;
const clone_1 = __importDefault(require("clone"));
const NeogmaConstraintError_1 = require("../../Errors/NeogmaConstraintError");
const StringSequence_1 = require("../../utils/StringSequence");
const Errors_1 = require("../../Errors");
/**
 * the bind param which should be passed to a query. It throws an error if more than one of each key is added
 */
class BindParam {
    constructor(...objects) {
        /** the object with the bind param */
        this.bind = {};
        this.add(...objects);
    }
    /** acquires a BindParam, so it ensures that a BindParam is always returned. If it's passed, it will be returned as is. Else, a new one will be created and returned */
    static acquire(bindParam) {
        return bindParam || new BindParam();
    }
    /**
     * adds objects to the bind attribute, throwing an error if a given key already exists in the bind param
     */
    add(...objects) {
        for (const object of objects) {
            for (const key in object) {
                if (this.bind.hasOwnProperty(key)) {
                    throw new NeogmaConstraintError_1.NeogmaConstraintError(`key ${key} already in the bind param`);
                }
                this.bind[key] = clone_1.default(object[key]);
            }
        }
        return this;
    }
    /** removes the given names from the bind param */
    remove(names) {
        const namesToUse = Array.isArray(names) ? names : [names];
        for (const name of namesToUse) {
            delete this.bind[name];
        }
    }
    /**
     * returns the bind attribute
     */
    get() {
        return this.bind;
    }
    /** returns a name which isn't a key of bind, and starts with the suffix */
    getUniqueName(suffix) {
        if (!this.bind.hasOwnProperty(suffix)) {
            return suffix;
        }
        else {
            const stringSequence = new StringSequence_1.StringSequence('a', 'zzzz', 4);
            for (let generationTry = 0; generationTry < 10000; generationTry++) {
                const newKey = suffix + '__' + stringSequence.getNextString(true);
                if (!this.bind.hasOwnProperty(newKey)) {
                    return newKey;
                }
            }
            throw new Errors_1.NeogmaError('Max number of tries for string generation reached');
        }
    }
    /** returns a name which isn't a key of bind and adds the value to the bind param with the created name */
    getUniqueNameAndAdd(suffix, value) {
        const name = this.getUniqueName(suffix);
        this.add({
            [name]: value,
        });
        return name;
    }
    /**
     * returns a new BindParam instance with a clone of the bind property
     */
    clone() {
        return new BindParam(clone_1.default(this.get()));
    }
}
exports.BindParam = BindParam;
//# sourceMappingURL=BindParam.js.map