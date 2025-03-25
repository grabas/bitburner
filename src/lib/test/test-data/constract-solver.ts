import {
    CodingContractAnswer,
    CodingContractData,
    CodingContractName,
    CodingContractSignatures
} from "/lib/component/contract/contract-names.enum";

export interface ConstractSolverTestData <T extends keyof CodingContractSignatures> {
    type: CodingContractName;
    data: CodingContractData<T>;
    solution: CodingContractAnswer<T>;
}

export const getTestData = (): ConstractSolverTestData<keyof CodingContractSignatures>[] => [
    {
        "type": CodingContractName.FindLargestPrimeFactor,
        "data": 819089512,
        "solution": 84827
    },
    {
        "type": CodingContractName.SubarrayWithMaximumSum,
        "data": [-6, -7, -7, -8, -1, -9, -3, 4, -10, 7, -9, -7, -8, -3, 3, -3, 7, -9, -10, 6],
        "solution": 7
    },
    {
        "type": CodingContractName.TotalWaysToSum,
        "data": 76,
        "solution": 9289090
    },
    {
        "type": CodingContractName.TotalWaysToSumII,
        "data": [49, [1, 2, 3, 6, 7, 8, 11, 12, 13, 14, 16, 17]],
        "solution": 15675
    },
    {
        "type": CodingContractName.SpiralizeMatrix,
        "data": [[29, 33], [17, 24], [30, 18], [22, 20], [48, 45], [32, 18], [5, 3]],
        "solution": [29, 33, 24, 18, 20, 45, 18, 3, 5, 32, 48, 22, 30, 17]
    },
    {
        "type": CodingContractName.ArrayJumpingGame,
        "data": [3, 0, 4, 1, 8, 3, 2],
        "solution": 1
    },
    {
        "type": CodingContractName.ArrayJumpingGameII,
        "data": [1, 0, 0, 3, 0, 3, 0, 3, 3, 3, 1, 2],
        "solution": 0
    },
    {
        "type": CodingContractName.MergeOverlappingIntervals,
        "data": [[1, 6], [2, 12], [6, 13], [9, 13], [14, 19], [14, 20], [15, 21], [16, 17], [18, 28], [19, 26], [19, 29], [21, 30], [23, 25], [25, 26]],
        "solution": [[1, 13], [14, 30]]
    },
    {
        "type": CodingContractName.GenerateIPAddresses,
        "data": "18255164126",
        "solution": [
            "18.255.164.126",
            "182.55.164.126"
        ]
    },
    {
        "type": CodingContractName.AlgorithmicStockTraderI,
        "data": [193, 158, 19, 109, 87, 142, 186, 12, 109, 19, 177, 30, 102, 26, 8, 16, 88, 58, 146, 156, 68, 14, 132, 4, 3, 170, 199, 121],
        "solution": 196
    },
    {
        "type": CodingContractName.AlgorithmicStockTraderII,
        "data": [112, 190, 48, 117, 9, 196, 95, 1, 95, 77, 9, 193, 57, 33, 133],
        "solution": 712
    },
    {
        "type": CodingContractName.AlgorithmicStockTraderIII,
        "data": [190, 170, 79, 33, 186, 132, 48, 87, 147, 16, 17, 138, 7, 103, 112, 20, 43, 113, 102, 198, 18, 100, 164, 8, 67, 182, 35, 40, 119, 8, 142, 33, 108, 99, 133, 161, 167],
        "solution": 365
    },
    {
        "type": CodingContractName.AlgorithmicStockTraderIV,
        "data": [10, [37, 160, 74, 192, 127, 147, 20, 79, 178, 81, 59, 161, 63, 39, 24, 171, 187, 188, 151, 95, 161, 12, 53, 123, 135, 133, 47, 93, 195, 160, 85, 192, 83, 127, 105]],
        "solution": 1153
    },
    {
        "type": CodingContractName.MinimumPathSumInATriangle,
        "data": [
            [9],
            [6, 9],
            [6, 1, 1],
            [1, 8, 2, 6],
            [6, 2, 1, 9, 8],
            [7, 3, 3, 7, 7, 5]
        ],
        "solution": 22
    },
    {
        "type": CodingContractName.UniquePathsInAGridI,
        "data": [14, 10],
        "solution": 497420
    },
    {
        "type": CodingContractName.UniquePathsInAGridII,
        "data": [[0, 0], [0, 0], [0, 0], [0, 0]],
        "solution": 4
    },
    {
        "type": CodingContractName.ShortestPathInAGrid,
        "data": [
            [0, 0, 1, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 1, 0, 1, 0, 1, 0],
            [1, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 1, 0, 1, 0, 0, 1],
            [1, 1, 1, 1, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 1, 0, 0, 0],
            [1, 0, 1, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 1, 0, 0]
        ],
        "solution": "RDDDDRRDRDDRRDDDRDR"
    },
    {
        "type": CodingContractName.SanitizeParenthesesInExpression,
        "data": ")()((())))))(a)a)((",
        "solution": [
            "(((()))(a)a)",
            "(((())))(aa)",
            "(((())))(a)a",
            "()((())(a)a)",
            "()((()))(aa)",
            "()((()))(a)a"
        ]
    },
    {
        "type": CodingContractName.FindAllValidMathExpressions,
        "data": ["6229700", -28],
        "solution": [
            "6+2*2*9-70+0",
            "6+2*2*9-70-0",
            "6+2-29-7+0+0",
            "6+2-29-7+0-0",
            "6+2-29-7+0*0",
            "6+2-29-7-0+0",
            "6+2-29-7-0-0",
            "6+2-29-7-0*0"
        ]
    },
    {
        "type": CodingContractName.HammingCodesIntegerToEncodedBinary,
        "data": 274129672559270,
        "solution": "1011011101001010110001110010011110000010101101010100110"
    },
    {
        "type": CodingContractName.HammingCodesEncodedBinaryToInteger,
        "data": "1000100000001000101010101110000100111100110010000010100010110011",
        "solution": 586521753692339
    },
    {
        "type": CodingContractName.Proper2ColoringOfAGraph,
        "data": [11, [[0, 9], [7, 9], [5, 9], [5, 6], [7, 10], [2, 10], [3, 6], [1, 5], [8, 9], [1, 7], [8, 10], [6, 8], [6, 7], [4, 8], [4, 7], [3, 9], [1, 8]]
        ],
        "solution": [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1]
    },
    {
        "type": CodingContractName.CompressionIRLECompression,
        "data": "uuVAAPPHHHHaaaGGGGGGGGGGGGGqqWOOOOOOOOOOOO88888888888888555xxL",
        "solution": "2u1V2A2P4H3a9G4G2q1W9O3O9858352x1L"
    },
    {
        "type": CodingContractName.CompressionIILZDecompression,
        "data": "5IeqcY9109913585WQ8WC548Qm3Brmqd374YyHI642tL236v6eYLU77",
        "solution": "IeqcYYYYYYYYYYYYYYYYYYY3YYYYYWQ8WCQ8WCQQm3Brmqdm3BYyHIYyHIYytLytv6eYLUtv6eYLU"
    },
    {
        "type": CodingContractName.CompressionIIILZCompression,
        "data": "niEjiFmLo4o4o4o4nWBp6MoFoFoFoFR7TrM1TH5GTrMHuH5GTrMHGTr30AeB",
        "solution": "9niEjiFmLo014628nWBp6MoF626R7TrM1143H5G382Hu788GTr30AeB"
    },
    {
        "type": CodingContractName.EncryptionICaesarCipher,
        "data": ["LOGIN MEDIA TABLE CLOUD PRINT", 17],
        "solution": "UXPRW VNMRJ CJKUN LUXDM YARWC"
    },
    {
        "type": CodingContractName.EncryptionIIVigenereCipher,
        "data": ["POPUPLINUXSHELLARRAYENTER", "DIGITAL"],
        "solution": "SWVCILTQCDAAEWOIXZTYPQBKZ"
    },
    {
        "type": CodingContractName.SquareRoot,
        "data": BigInt("156780530982168960764931552374429639993613484225019523676807233403532122949538735985903920708033365892521202076538608348930160347176908987750281299037716652921886447043395734847818532699326904517836802"),
        "solution": BigInt("12521203256163880385335096727613254719576376860752236497958743894602869570442241288423655599662153726")
    }
]