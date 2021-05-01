/** The base error which is thrown in neogma. All other errors entend this. */
export declare class NeogmaError extends Error {
    message: string;
    data: Record<string, any>;
    constructor(message: NeogmaError['message'], data?: NeogmaError['data']);
}
