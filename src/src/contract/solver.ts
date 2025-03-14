import { IContractSolver } from './iContractSolver';
import { AlgorithmicStockTrader } from './solvers/algorithmicStockTrader';
import { AlgorithmicStockTrader2 } from "./solvers/algorithmicStockTrader2";
import { AlgorithmicStockTrader3 } from "./solvers/algorithmicStockTrader3";
import { AlgorithmicStockTrader4 } from "./solvers/algorithmicStockTrader4";
import { GenerateIpAddresses } from "./solvers/generateIpAddresses";
import { MaxSumSubarray } from "./solvers/maxSumSubarray";
import { CaesarCipher } from "./solvers/caesarCipher";
import { VigenereCipher } from "./solvers/vigenereCipher";
import { SquareRoot } from "./solvers/squareRoot";
import { LargestPrimeFactor } from "./solvers/largestPrimeFactor";
import { TotalWaysSum } from "./solvers/totalWaysSum";
import { TotalWaysSum2 } from "./solvers/totalWaysSum2";
import { SpiralizeMatrix } from "./solvers/spiralizeMatrix";
import { ArrayJumpingGame } from "./solvers/arrayJumpingGame";
import { ArrayJumpingGame2 } from "./solvers/arrayJumpingGame2";
import { MergeOverlappingIntervals } from "./solvers/mergeOverlappingIntervals";
import { UniquePathsOnGrind2 } from "./solvers/uniquePathsOnGrind2";
import { MinimumPathSumInTriangle } from "./solvers/minimumPathSumInTriangle";
import { UniquePathsOnGrind } from "./solvers/uniquePathsOnGrind";
import { ShortestPathInGrid } from "./solvers/shortestPathInGrid";
import { SanitizeParenthesesInExpression } from "./solvers/sanitizeParenthesesInExpression";
import { FindAllValidMathExpressions } from "./solvers/findAllValidMathExpressions";
import { IntegerToEncodedBinary } from "./solvers/integerToEncodedBinary";
import { EncodedBinaryToInteger } from "./solvers/encodedBinaryToInteger";
import { ColoringOfAGraph } from "./solvers/coloringOfAGraph";
import { CompressionRLE } from "./solvers/compressionRLE";
import { DecompressionLZ } from "./solvers/decompressionLZ";
import { CompressionLZ } from "./solvers/compressionLZ";

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
    new CompressionRLE(),
    new DecompressionLZ(),
    new CompressionLZ()
];

const solverMap = new Map<string, IContractSolver<unknown, unknown>>();
solvers.forEach(solver => solverMap.set(solver.getType(), solver as IContractSolver<unknown, unknown>))

export const getSolver = (solver: string):  IContractSolver<unknown, unknown> | undefined => solverMap.get(solver);