type Options<T> = {
    fn: (props: T) => any;
    props: T | undefined;
    delay: number;
    err: (props: Error) => void | undefined;
    reset: number;
};
type AnyAsyncFunction = (...args: any[]) => Promise<any>;
export declare function wr<T extends AnyAsyncFunction, J>(func: T, options: Options<J>): (...args: Parameters<T>) => Promise<ReturnType<T>>;
export {};
//# sourceMappingURL=index.d.ts.map