import { ContractSolverInterface } from './contract-solver.interface';
import { AlgorithmicStockTrader } from './solvers/algorithmic-stock-trader';
import { AlgorithmicStockTrader2 } from "./solvers/algorithmic-stock-trader-2";
import { AlgorithmicStockTrader3 } from "./solvers/algorithmic-stock-trader-3";
import { AlgorithmicStockTrader4 } from "./solvers/algorithmic-stock-trader-4";
import { GenerateIpAddresses } from "./solvers/generate-ip-addresses";
import { MaxSumSubarray } from "./solvers/max-sum-subarray";
import { CaesarCipher } from "./solvers/caesar-cipher";
import { VigenereCipher } from "./solvers/vigenere-cipher";
import { SquareRoot } from "./solvers/square-root";
import { LargestPrimeFactor } from "./solvers/largest-prime-factor";
import { TotalWaysSum } from "./solvers/total-ways-sum";
import { TotalWaysSum2 } from "./solvers/total-ways-sum-2";
import { SpiralizeMatrix } from "./solvers/spiralize-matrix";
import { ArrayJumpingGame } from "./solvers/array-jumping-game";
import { ArrayJumpingGame2 } from "./solvers/array-jumping-game-2";
import { MergeOverlappingIntervals } from "./solvers/merge-overlapping-intervals";
import { UniquePathsOnGrind2 } from "./solvers/unique-paths-on-grind-2";
import { MinimumPathSumInTriangle } from "./solvers/minimum-path-sum-in-triangle";
import { UniquePathsOnGrind } from "./solvers/unique-paths-on-grind";
import { ShortestPathInGrid } from "./solvers/shortest-path-in-grid";
import { SanitizeParenthesesInExpression } from "./solvers/sanitize-parentheses-in-expression";
import { FindAllValidMathExpressions } from "./solvers/find-all-valid-math-expressions";
import { IntegerToEncodedBinary } from "./solvers/integer-to-encoded-binary";
import { EncodedBinaryToInteger } from "./solvers/encoded-binary-to-integer";
import { ColoringOfAGraph } from "./solvers/coloring-of-a-graph";
import { RleCompression } from "./solvers/rle-compression";
import { LzDecompression } from "./solvers/lz-decompression";
import { LzCompression } from "./solvers/lz-compression";

const solvers = [
    new AlgorithmicStockTrader(),
    new AlgorithmicStockTrader2(),
    new AlgorithmicStockTrader3(),
    new AlgorithmicStockTrader4(),
    new ArrayJumpingGame(),
    new ArrayJumpingGame2(),
    new GenerateIpAddresses(),
    new MaxSumSubarray(),
    new CaesarCipher(),
    new VigenereCipher(),
    new SquareRoot(),
    new UniquePathsOnGrind(),
    new UniquePathsOnGrind2(),
    new LargestPrimeFactor(),
    new TotalWaysSum(),
    new TotalWaysSum2(),
    new SpiralizeMatrix(),
    new MergeOverlappingIntervals(),
    new MinimumPathSumInTriangle(),
    new ShortestPathInGrid(),
    new SanitizeParenthesesInExpression(),
    new FindAllValidMathExpressions(),
    new IntegerToEncodedBinary(),
    new EncodedBinaryToInteger(),
    new ColoringOfAGraph(),
    new RleCompression(),
    new LzDecompression(),
    new LzCompression()
];

const solverMap = new Map<string, ContractSolverInterface<unknown, unknown>>();
solvers.forEach(solver => solverMap.set(solver.getType(), solver as ContractSolverInterface<unknown, unknown>))

export const getSolver = (solver: string):  ContractSolverInterface<unknown, unknown> | undefined => solverMap.get(solver);