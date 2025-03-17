import React, { ReactDOM, cDocument } from "/lib/react";
import { NS } from "@ns";
import { DraggableWindow } from "/ui/DraggableWindow";
import { uuidv4 } from "/src/utils/uuidv4";
import { FileLogger } from "/src/logger/file.logger";
import { LoggerPrefixes } from "/src/enum/logger-prefixes.enum";
import LiveChart from "/ui/chart/LiveChart";

let globalBatchData: BatchEntry[] = [];

interface BatchEntry {
    id: number;
    operation: string;
    target: string;
    sleepTime: number;
    expectedDuration: number;
    actualDuration: number;
    totalDuration: number;
    scriptStart: number;
}

const getBatchData = () => globalBatchData;

const transformBatchData = (data: BatchEntry[], type: string) =>
    data.filter(entry => entry.operation === type)
        .map(entry => ({
            x: entry.id,
            y: entry.actualDuration - entry.expectedDuration,
        }));

export async function main(ns: NS) {
    ns.disableLog("asleep");
    const type = ns.args[0] as string;
    const fileId = ns.args[1] as string;

    const root = cDocument.getElementById("root") as HTMLElement;
    const graphContainer = cDocument.createElement("div");
    graphContainer.id = uuidv4();
    graphContainer.className = "react-draggable MuiBox-root";
    root.appendChild(graphContainer);

    ReactDOM.render(
        <DraggableWindow title={`${type} Desync`} containerId={graphContainer.id}>
            <LiveChart
                title="Batch Desync Chart"
                source={getBatchData}
                transform={(data) => transformBatchData(data, type)}
                refreshInterval={1000}
            />
        </DraggableWindow>,
        graphContainer
    );

    const logger = new FileLogger(ns);

    while (true) {
        const fileContents = logger.read(LoggerPrefixes.BATCHATTACK + fileId);
        try {
            globalBatchData = JSON.parse("[{}" + fileContents + "]");
        } catch (error) {
            ns.tprint("Error parsing JSON file: " + error);
        }
        await ns.sleep(500);
    }
}