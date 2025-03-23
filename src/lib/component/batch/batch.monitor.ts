import { NS } from "@ns";
import { Batch } from "./batch"; // adjust path if needed
import { getProgressBar } from "/lib/utils/progress-bar";
import { Colors } from "/lib/enum/colors.enum";
import {BatchConfig} from "/lib/component/batch/batch.config";
import {ServerDto} from "/lib/entity/server/server.dto";
import {BatchType, IBatch} from "/lib/component/batch/batch.interface";

const TOTAL_LINE_WIDTH = 36;

function getSpaceForLine(label: string, valueStr: string): string {
    const padLength = TOTAL_LINE_WIDTH - label.length - valueStr.length;
    return " ".repeat(Math.max(0, padLength));
}

function setColor(
    value: number,
    isGreen: (val: number) => boolean,
    isYellow: (val: number) => boolean
): string {
    if (isGreen(value)) {
        return Colors.GREEN;
    } else if (isYellow(value)) {
        return Colors.YELLOW;
    } else {
        return Colors.RED;
    }
}

function setColorValue(text: string, color: string): string {
    return `${color}${text}${Colors.RESET}`;
}

const LABELS = {
    MONEY: "$_______:",
    SECURITY: "Security:",
    INCOME_CYCLE: "Income per cycle:",
    INCOME_SECOND: "Income per second:",
    BATCHES: "Batches:",
    RAM_PER_BATCH: "RAM per batch:",
    RAM_TOTAL: "RAM total:",
};

export function printLog(
    ns: NS,
    batch: IBatch,
    waveSize = 1,
    deploying = false,
    preparing = false,
): void {
    ns.clearLog();
    const target = batch.target;
    const hostname = target.hostname.toUpperCase();
    const headerPadding = Math.max(0, TOTAL_LINE_WIDTH - hostname.length - 2);
    const leftPad = Math.floor(headerPadding / 2);
    const rightPad = headerPadding - leftPad;
    ns.print(`${Colors.PURPLE}${"-".repeat(leftPad)} ${hostname} ${"-".repeat(rightPad)}${Colors.PURPLE}-`);

    const cycleDuration = (waveSize - 1) * BatchConfig.BATCH_SEPARATION + batch.duration + BatchConfig.TIME_BUFFER
    const incomePerCycle = batch.targetAmount * waveSize;

    const income = ns.formatNumber(incomePerCycle);
    const incomePerSecond = ns.formatNumber(incomePerCycle / (cycleDuration / 1000));

    const serverMaxRam = batch.host.refresh().ram.max;
    const totalWaveRam = batch.ramCost * waveSize;
    const ramPerBatch = ns.formatRam(batch.ramCost);
    const totalRam = ns.formatRam(parseFloat((totalWaveRam).toFixed(2)));
    const percentage = (totalWaveRam / serverMaxRam) * 100;
    const totalRamString = `${totalRam} (${percentage.toFixed(2)}%)`

    const moneyAvailable = target.getMoneyAvailable();
    const moneyAvailablePercentage = (moneyAvailable / target.money.max) * 100;
    const moneyStr = moneyAvailablePercentage.toFixed(2) + "%";
    const moneyColor = setColor(moneyAvailablePercentage, val => val === 100, val => val >= 51);
    const coloredMoney = setColorValue(`${moneyStr}`, moneyColor);

    const minSec = target.security.min;
    const sec = target.getSecurityLevel();
    const deltaSec = sec - minSec;
    const secStr = "+" + deltaSec.toFixed(2);
    const secColor = setColor(deltaSec, val => val === 0, val => val <= 1);
    const coloredSec = setColorValue(`${secStr}`, secColor);

    ns.print(`${LABELS.MONEY}${getSpaceForLine(LABELS.MONEY, moneyStr)}${coloredMoney}`);
    ns.print(`${LABELS.SECURITY}${getSpaceForLine(LABELS.SECURITY, secStr)}${coloredSec}`);
    ns.print("\t");
    ns.print(`${LABELS.INCOME_CYCLE}${getSpaceForLine(LABELS.INCOME_CYCLE, income)}${setColorValue(income, Colors.GREEN)}`);
    ns.print(`${LABELS.INCOME_SECOND}${getSpaceForLine(LABELS.INCOME_SECOND, incomePerSecond)}${setColorValue(incomePerSecond, Colors.GREEN)}`);
    ns.print(`${LABELS.BATCHES}${getSpaceForLine(LABELS.BATCHES, waveSize.toString())}${setColorValue(waveSize.toString(), Colors.PURPLE)}`);
    ns.print(`${LABELS.RAM_PER_BATCH}${getSpaceForLine(LABELS.RAM_PER_BATCH, ramPerBatch)}${ramPerBatch}`);
    ns.print(`${LABELS.RAM_TOTAL}${getSpaceForLine(LABELS.RAM_TOTAL, totalRamString)}${setColorValue(totalRamString, Colors.RED)}`);

    if (deploying) {
        const deployingStr = "...deploying";
        ns.print(`${getSpaceForLine("", deployingStr)}${setColorValue(deployingStr, Colors.YELLOW)}`);
        ns.print("\t");
    } else if (preparing) {
        const preparingStr = "...preparing";
        ns.print(`${getSpaceForLine("", preparingStr)}${setColorValue(preparingStr, Colors.YELLOW)}`);
        ns.print("\t");
    }
}

export async function monitor(ns: NS, batch: IBatch, waveSize = 1): Promise<void> {
    const startTime = Date.now();
    const finishTime = startTime + batch.duration;

    while (Date.now() <= finishTime) {
        printLog(ns, batch, waveSize);

        const text = batch.type === BatchType.PREPARE
            ? setColorValue("Preparing", Colors.YELLOW)
            : setColorValue("Deploying", Colors.GREEN);

        ns.print(getProgressBar(startTime, batch.duration, text));
        await ns.sleep(10);
    }
}