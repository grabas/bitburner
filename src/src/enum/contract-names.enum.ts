export enum CodingContractName {
    FindLargestPrimeFactor = "Find Largest Prime Factor",
    SubarrayWithMaximumSum = "Subarray with Maximum Sum",
    TotalWaysToSum = "Total Ways to Sum",
    TotalWaysToSumII = "Total Ways to Sum II",
    SpiralizeMatrix = "Spiralize Matrix",
    ArrayJumpingGame = "Array Jumping Game",
    ArrayJumpingGameII = "Array Jumping Game II",
    MergeOverlappingIntervals = "Merge Overlapping Intervals",
    GenerateIPAddresses = "Generate IP Addresses",
    AlgorithmicStockTraderI = "Algorithmic Stock Trader I",
    AlgorithmicStockTraderII = "Algorithmic Stock Trader II",
    AlgorithmicStockTraderIII = "Algorithmic Stock Trader III",
    AlgorithmicStockTraderIV = "Algorithmic Stock Trader IV",
    MinimumPathSumInATriangle = "Minimum Path Sum in a Triangle",
    UniquePathsInAGridI = "Unique Paths in a Grid I",
    UniquePathsInAGridII = "Unique Paths in a Grid II",
    ShortestPathInAGrid = "Shortest Path in a Grid",
    SanitizeParenthesesInExpression = "Sanitize Parentheses in Expression",
    FindAllValidMathExpressions = "Find All Valid Math Expressions",
    HammingCodesIntegerToEncodedBinary = "HammingCodes: Integer to Encoded Binary",
    HammingCodesEncodedBinaryToInteger = "HammingCodes: Encoded Binary to Integer",
    Proper2ColoringOfAGraph = "Proper 2-Coloring of a Graph",
    CompressionIRLECompression = "Compression I: RLE Compression",
    CompressionIILZDecompression = "Compression II: LZ Decompression",
    CompressionIIILZCompression = "Compression III: LZ Compression",
    EncryptionICaesarCipher = "Encryption I: Caesar Cipher",
    EncryptionIIVigenereCipher = "Encryption II: Vigenère Cipher",
    SquareRoot = "Square Root",
}

export type CodingContractSignatures = {
    [CodingContractName.FindLargestPrimeFactor]: [number, number];
    [CodingContractName.SubarrayWithMaximumSum]: [number[], number];
    [CodingContractName.TotalWaysToSum]: [number, number];
    [CodingContractName.TotalWaysToSumII]: [[number, number[]], number];
    [CodingContractName.SpiralizeMatrix]: [number[][], number[]];
    [CodingContractName.ArrayJumpingGame]: [number[], 1 | 0];
    [CodingContractName.ArrayJumpingGameII]: [number[], number];
    [CodingContractName.MergeOverlappingIntervals]: [[number, number][], [number, number][]];
    [CodingContractName.GenerateIPAddresses]: [string, string[]];
    [CodingContractName.AlgorithmicStockTraderI]: [number[], number];
    [CodingContractName.AlgorithmicStockTraderII]: [number[], number];
    [CodingContractName.AlgorithmicStockTraderIII]: [number[], number];
    [CodingContractName.AlgorithmicStockTraderIV]: [[number, number[]], number];
    [CodingContractName.MinimumPathSumInATriangle]: [number[][], number];
    [CodingContractName.UniquePathsInAGridI]: [[number, number], number];
    [CodingContractName.UniquePathsInAGridII]: [(1 | 0)[][], number];
    [CodingContractName.ShortestPathInAGrid]: [(1 | 0)[][], string];
    [CodingContractName.SanitizeParenthesesInExpression]: [string, string[]];
    [CodingContractName.FindAllValidMathExpressions]: [[string, number], string[]];
    [CodingContractName.HammingCodesIntegerToEncodedBinary]: [number, string];
    [CodingContractName.HammingCodesEncodedBinaryToInteger]: [string, number];
    [CodingContractName.Proper2ColoringOfAGraph]: [[number, [number, number][]], (1 | 0)[]];
    [CodingContractName.CompressionIRLECompression]: [string, string];
    [CodingContractName.CompressionIILZDecompression]: [string, string];
    [CodingContractName.CompressionIIILZCompression]: [string, string];
    [CodingContractName.EncryptionICaesarCipher]: [[string, number], string];
    [CodingContractName.EncryptionIIVigenereCipher]: [[string, string], string];
    [CodingContractName.SquareRoot]: [bigint, bigint, [string, string]];
};

export type CodingContractData<T extends keyof CodingContractSignatures> = CodingContractSignatures[T][0];
export type CodingContractAnswer<T extends keyof CodingContractSignatures> = CodingContractSignatures[T][1];