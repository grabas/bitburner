import React, {useEffect, useState} from "/lib/react";
import ApexChart from "./ApexChart";
import { NS } from "@ns";
import {BatchLog} from "/src/component/batch/batch.interface";

interface BatchAttackDashboardProps {
    ns: NS;
    portNumber: number;
}

const BatchAttackDashboard: React.FC<BatchAttackDashboardProps> = ({ ns, portNumber }) => {
    const [logs, setLogs] = useState<BatchLog[]>([]);
    useEffect(() => {
        let cancelled = false;
        async function pollPort() {
            const port = ns.getPortHandle(portNumber);
            while (!cancelled) {
                const newLogs: BatchLog[] = [];
                let msg = port.read();
                while (msg !== "NULL PORT DATA") {
                    try {
                        const log: BatchLog = JSON.parse(msg);
                        newLogs.push(log);
                    } catch (err) {
                        ns.tprint("Error parsing log message: " + err);
                    }
                    msg = port.read();
                }
                if (newLogs.length > 0) {
                    setLogs((prev) => [...prev, ...newLogs]);
                }
                await ns.sleep(500);
            }
        }
        pollPort();

        return () => {
            cancelled = true;
        };
    }, []);

    const getOrderComparisonData = () => {
        const categories = logs.map((_, index) => index);
        const data = logs.map(() => 1);

        const colors = logs.map((log, index) => {
            if (index !== log.id) return "#FF0000";
            if (log.operation === "hack") return "#008FFB";
            if (log.operation === "grow") return "#00E396";
            if (log.operation === "weaken") return "#FEB019";
            return "#FFFFFF";  // fallback
        });

        return { categories, data, colors };
    };

    const orderDesync = getOrderComparisonData();

    const barChartOptions = {
        chart: { type: "bar", height: 250, toolbar: { show: false } },
        plotOptions: { bar: { distributed: true } },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: orderDesync.categories,
            labels: {show: false, style: {colors: "#fff"}},
        },
        yaxis: { labels: { style: { colors: "#fff" } } },
        title: { text: "Batch Order", style: {color: "#fff"}},
        colors: orderDesync.colors,
        legend: { show: false },
        responsive: [{
            breakpoint: 1000,
            options: {
                plotOptions: { bar: { horizontal: false } },
                legend: { position: "bottom", labels: { colors: "#fff" } }
            }
        }]
    };

    const barChartSeries = [{ name: "Desync", data: orderDesync.data }];

    const securityData = [...logs].map((log, index) => ({
        x: index,
        y: log.security.level.toFixed(2),
    }));
    const moneyData = [...logs].map((log, index) => ({
        x: index,
        y: (log.money.available / log.money.max * 100).toFixed(2),
    }));
    const lineChartOptions = {
        chart: { type: "line", height: 250, toolbar: { show: false }},
        xaxis: { labels: {show: false, style: {colors: "#fff"}}},
        yaxis: { labels: {style: {colors: "#fff"}}},
        title: { text: "Money (%) and Security", style: {color: "#fff"}},
        legend: { position: "bottom", labels: {colors: ["#fff", "#fff"]}},
        responsive: [{breakpoint: 1000, options: {plotOptions: {bar: {horizontal: false}}, legend: {position: "bottom",labels: {colors: "#fff"}}}}]
    };
    const lineChartSeries = [
        { name: "Server Security", data: securityData },
        { name: "Money Available", data: moneyData },
    ];

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
    const desyncChartOptions = {
        chart: { type: "line", height: 250, toolbar: { show: false }},
        xaxis: { labels: {style: {colors: "#fff"}}},
        yaxis: { labels: {style: {colors: "#fff"}}},
        title: { text: "Script Desync (ms)", style: {color: "#fff"}},
        legend: { position: "bottom", labels: {colors: ["#fff", "#fff", "#fff"]}},
        responsive: [{breakpoint: 1000, options: {plotOptions: {bar: {horizontal: false}}, legend: {position: "bottom",labels: {colors: "#fff"}}}}]
    };
    const desyncChartSeries = operations.map((op) => ({
        name: op,
        data: desyncData[op],
    }));

    return (
        <div style={{ padding: "10px", fontFamily: "sans-serif" }}>
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