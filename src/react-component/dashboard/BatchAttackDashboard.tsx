import React, {useState} from "/react-component/react";
import ApexChart from "../chart/ApexChart";
import { NS } from "@ns";
import {BatchMonitorLog} from "/lib/component/batch/batch.interface";
import {getBatchOrderOptions, getMoneyAndSecurityOptions} from "/react-component/dashboard/BatchAttackDashboard.options";
import usePortListener from "/react-component/hooks/use-port-listener";

export const CLEAR_LOGS = "CLEAR_LOGS";

interface BatchAttackDashboardProps {
    ns: NS;
    portNumber: number;
}

const BatchAttackDashboard: React.FC<BatchAttackDashboardProps> = ({ ns, portNumber }) => {
    const [logs, setLogs] = useState<BatchMonitorLog[]>([]);
    const handleMessages = (newMessages: BatchMonitorLog[]) => {
        if (newMessages.length === 0) {
            setLogs([]);
        } else {
            setLogs(prev => [...prev, ...newMessages]);
        }
    };

    usePortListener<BatchMonitorLog>(ns, portNumber, JSON.parse, handleMessages, CLEAR_LOGS);


    /* ######## Order desync ######## */


    const getOrderComparisonData = () => {
        const categories = logs.map((_, index) => index);
        const data = logs.map(() => 1);

        const colors = logs.map((log, index) => {
            if (index !== log.id) return "#FF0000";
            if (log.operation === "hack") return "#008FFB";
            if (log.operation === "grow") return "#00E396";
            if (log.operation === "weaken") return "#FEB019";
            return "#FFFFFF";
        });

        return { categories, data, colors };
    };

    const orderDesync = getOrderComparisonData();
    const barChartOptions = getBatchOrderOptions(orderDesync.categories, orderDesync.colors);
    const barChartSeries = [{ name: "Desync", data: orderDesync.data }];


    /* ######## Money and Security ######## */


    const securityData = [...logs].map((log, index) => ({
        x: index,
        y: log.securityLevel.toFixed(2),
    }));

    const moneyData = [...logs].map((log, index) => ({
        x: index,
        y: (log.moneyAvailable / log.moneyMax * 100).toFixed(2),
    }));

    const lineChartOptions = getMoneyAndSecurityOptions()
    const lineChartSeries = [
        { name: "Server Security", data: securityData },
        { name: "Money Available", data: moneyData },
    ];


    /* ######## Execution Desync ######## */

    const operations = ["hack", "grow", "weaken"];
    const desyncData: Record<string, { x: number; y: string }[]> = {
        hack: [],
        grow: [],
        weaken: [],
    };

    [...logs].forEach((log, index) => {
        if (operations.includes(log.operation)) {
            const desync = (log.actualDuration - log.expectedDuration).toFixed(2)
            desyncData[log.operation].push({ x: index, y: desync });
        }
    });

    const desyncChartOptions = getMoneyAndSecurityOptions();
    const desyncChartSeries = operations.map((op) => ({
        name: op,
        data: desyncData[op],
    }));

    return (
        <div style={{ padding: "10px" }}>
            <div style={{ marginBottom: "30px" }}>
                <ApexChart options={barChartOptions} series={barChartSeries} />
            </div>
            <div style={{ marginBottom: "30px" }}>
                <ApexChart options={lineChartOptions} series={lineChartSeries} />
            </div>
            <div style={{ marginBottom: "30px" }}>
                <ApexChart options={desyncChartOptions} series={desyncChartSeries} />
            </div>
        </div>
    );
};

export default BatchAttackDashboard;