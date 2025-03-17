import { ISolver } from '../solver.interface.js';
import {CodingContractName} from "/src/enum/contract-names.enum";

export class ColoringOfAGraph implements ISolver<CodingContractName.Proper2ColoringOfAGraph> {
    solve([numVertices, edges]: [number, [number, number][]]): (1 | 0)[] {
        const adjacencyList: number[][] = Array.from({ length: numVertices }, () => []);
        for (const [u, v] of edges) {
            adjacencyList[u].push(v);
            adjacencyList[v].push(u);
        }

        const colors: (1 | 0 | null)[] = new Array(numVertices).fill(null);
        for (let vertex = 0; vertex < numVertices; vertex++) {
            if (colors[vertex] === null) {
                const queue: number[] = [vertex];
                colors[vertex] = 0;
                while (queue.length) {
                    const current = queue.shift()!;
                    const currentColor = colors[current]!;
                    for (const neighbor of adjacencyList[current]) {
                        if (colors[neighbor] === null) {
                            colors[neighbor] = (1 - currentColor) as 1 | 0;
                            queue.push(neighbor);
                        } else if (colors[neighbor] === currentColor) {
                            return [];
                        }
                    }
                }
            }
        }
        return colors as (1 | 0)[];
    }

    getType(): CodingContractName {
        return CodingContractName.Proper2ColoringOfAGraph;
    }
}