import React, { ReactDOM, cDocument } from "/lib/react";
import { NS } from "@ns";
import { DraggableWindow } from "/ui/DraggableWindow";
import { uuidv4 } from "/src/utils/uuidv4";
import LiveChart from "/ui/chart/LiveChart";

let globalHackingHistory: { index: number; skill: number }[] = [];
let index = 0; // Incrementing index for x-axis

const getStoredHackingData = () => globalHackingHistory;

const transformHackingData = (data: { index: number; skill: number }[]) =>
    data.map(entry => ({
        x: entry.index, // Uses index instead of timestamps
        y: entry.skill,
    }));

export async function main(ns: NS) {
    ns.disableLog("asleep");

    const root = cDocument.getElementById("root") as HTMLElement;
    const graphContainer = cDocument.createElement("div");
    graphContainer.id = uuidv4();
    graphContainer.className = "react-draggable MuiBox-root";
    root.appendChild(graphContainer);

    ReactDOM.render(
        <DraggableWindow title="Hacking Skill Progression" containerId={graphContainer.id}>
            <LiveChart
                source={getStoredHackingData} // Uses the stored global data
                transform={transformHackingData}
                refreshInterval={1000}
            />
        </DraggableWindow>,
        graphContainer
    );

    // 🔄 Keep updating the global hacking skill data
    while (true) {
        const hackingSkill = ns.getPlayer().skills.hacking;

        globalHackingHistory.push({ index, skill: hackingSkill });
        index++;

        // Keep only the last 100 entries for performance
        if (globalHackingHistory.length > 100) {
            globalHackingHistory.shift();
        }

        await ns.sleep(1000); // Update every second
    }
}