export interface ITest {
    test(): Promise<boolean>;
    runTest(): Promise<void>;
    report(result: TestResult): void;
}

export type TestResult = {
    test: string;
    message: string;
    result: boolean;
}