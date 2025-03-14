import { IContractSolver } from '../iContractSolver.js';

export class CompressionLZ implements IContractSolver<string, string> {
    solve(plain: string): string {
        const create2DArray = (): (string | null)[][] =>
            Array.from({ length: 10 }, () => Array(10).fill(null));
        let currentState = create2DArray();
        let nextState = create2DArray();

        const setState = (state: (string | null)[][], offset: number, length: number, value: string) => {
            const existing = state[offset][length];
            if (existing === null || value.length < existing.length) {
                state[offset][length] = value;
            } else if (value.length === existing.length && Math.random() < 0.5) {
                state[offset][length] = value;
            }
        };

        currentState[0][1] = "";
        for (let i = 1; i < plain.length; ++i) {
            for (let r = 0; r < 10; r++) nextState[r].fill(null);
            const currentChar = plain[i];
            for (let litLen = 1; litLen <= 9; ++litLen) {
                const currentLiteral = currentState[0][litLen];
                if (currentLiteral === null) continue;
                if (litLen < 9) {
                    setState(nextState, 0, litLen + 1, currentLiteral);
                } else {
                    setState(nextState, 0, 1, currentLiteral + "9" + plain.substring(i - 9, i) + "0");
                }
                for (let off = 1; off <= Math.min(9, i); ++off) {
                    if (plain[i - off] === currentChar) {
                        setState(nextState, off, 1, currentLiteral + String(litLen) + plain.substring(i - litLen, i));
                    }
                }
            }
            for (let off = 1; off <= 9; ++off) {
                for (let seqLen = 1; seqLen <= 9; ++seqLen) {
                    const currentRef = currentState[off][seqLen];
                    if (currentRef === null) continue;
                    if (plain[i - off] === currentChar) {
                        if (seqLen < 9) {
                            setState(nextState, off, seqLen + 1, currentRef);
                        } else {
                            setState(nextState, off, 1, currentRef + "9" + String(off) + "0");
                        }
                    }
                    setState(nextState, 0, 1, currentRef + String(seqLen) + String(off));
                    for (let newOff = 1; newOff <= Math.min(9, i); ++newOff) {
                        if (plain[i - newOff] === currentChar) {
                            setState(nextState, newOff, 1, currentRef + String(seqLen) + String(off) + "0");
                        }
                    }
                }
            }
            [currentState, nextState] = [nextState, currentState];
        }
        let result: string | null = null;
        for (let litLen = 1; litLen <= 9; ++litLen) {
            const candidateBase = currentState[0][litLen];
            if (candidateBase === null) continue;
            const candidate = candidateBase + String(litLen) + plain.substring(plain.length - litLen);
            if (result === null || candidate.length < result.length || (candidate.length === result.length && Math.random() < 0.5)) {
                result = candidate;
            }
        }
        for (let off = 1; off <= 9; ++off) {
            for (let seqLen = 1; seqLen <= 9; ++seqLen) {
                const candidateBase = currentState[off][seqLen];
                if (candidateBase === null) continue;
                const candidate = candidateBase + String(seqLen) + String(off);
                if (result === null || candidate.length < result.length || (candidate.length === result.length && Math.random() < 0.5)) {
                    result = candidate;
                }
            }
        }
        return result ?? "";
    }

    getType(): string {
        return 'Compression III: LZ Compression';
    }
}