import { SolverInterface } from '../solver.interface.js';

export class ColoringOfAGraph implements SolverInterface<[number, number[][]], number[]> {
    solve(data: [number, number[][]]): number[] {
        const [numVertices, edges] = data;
        const adjacencyList: number[][] = Array.from({ length: numVertices }, () => []);
        for (const [u, v] of edges) {
            adjacencyList[u].push(v);
            adjacencyList[v].push(u);
        }
        const colors: number[] = new Array(numVertices).fill(-1);
        for (let vertex = 0; vertex < numVertices; vertex++) {
            if (colors[vertex] === -1) {
                const queue: number[] = [vertex];
                colors[vertex] = 0;
                while (queue.length) {
                    const current = queue.shift()!;
                    for (const neighbor of adjacencyList[current]) {
                        if (colors[neighbor] === -1) {
                            colors[neighbor] = 1 - colors[current];
                            queue.push(neighbor);
                        } else if (colors[neighbor] === colors[current]) {
                            return [];
                        }
                    }
                }
            }
        }
        return colors;
    }

    getType(): string {
        return 'Proper 2-Coloring of a Graph';
    }
}