/**
 * provides a sequence of string in order, i.e. 'aaa', 'aab' etc
 * warps around when the target is reached
 */
export declare class StringSequence {
    private padSize;
    private alphabetSize;
    private initialNumber;
    private currentNumber;
    private targetNumber;
    constructor(from: string, to: string, padSize?: number, alphabetSize?: number);
    getNextString: (throwOnTargetExcceeded?: boolean | undefined) => string;
    private stringToNumber;
    private numberToString;
    /**
     * pads the string by prepending 'a' at the start of it until the padSize is reached
     */
    private pad;
}
