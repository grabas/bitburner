import { NS } from "@ns";
import { DraggableWindow } from "/react-component/DraggableWindow";
import BatchAttackDashboard from "/react-component/chart/BatchAttackDashboard";
import { uuidv4 } from "/lib/utils/uuidv4";
import React, {ReactDOM, cDocument, scheduler} from "/react-component/react";

export async function main(ns: NS) {
    ns.disableLog("asleep");
    ns.ui.openTail()

    // Use the #root element if it exists; otherwise fallback to body.
    const root = cDocument.getElementById("root") || cDocument.body;
    const graphContainer = cDocument.createElement("div");
    graphContainer.id = uuidv4();
    graphContainer.className = "react-draggable MuiBox-root";
    root.appendChild(graphContainer);

    ns.ui.closeTail()
    ReactDOM.render(
        <DraggableWindow containerId={graphContainer.id} title="Batch Dashboard" x={1020} y={20}>
            <BatchAttackDashboard ns={ns} portNumber={ns.args[0] as number} />
        </DraggableWindow>,
        graphContainer
    );


    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const sleep = (delay: number) => scheduler.postTask(() => {}, {delay});

    // eslint-disable-next-line no-constant-condition
    while (true) {
        if (!cDocument.getElementById(graphContainer.id)) {
            break;
        }
        await sleep(500);
    }
}