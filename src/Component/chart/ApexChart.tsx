import React, { useEffect, useRef, cDocument, cWindow } from "/lib/react";

let apexScriptPromise: Promise<void> | null = null;

const loadApexScript = async (): Promise<void> => {
    const apexSrc = "https://cdn.jsdelivr.net/npm/apexcharts";
    if (!apexScriptPromise) {
        if (!cDocument.querySelector(`script[src="${apexSrc}"]`)) {
            const script = cDocument.createElement("script");
            script.src = apexSrc;
            script.async = false;
            cDocument.head.appendChild(script);
            apexScriptPromise = new Promise<void>((resolve, reject) => {
                script.onload = () => resolve();
                script.onerror = () => reject(new Error("Failed to load ApexCharts script"));
            });
        } else {

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (cWindow.ApexCharts) {
                apexScriptPromise = Promise.resolve();
            } else {
                apexScriptPromise = new Promise<void>((resolve) => {
                    const interval = setInterval(() => {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        if (cWindow.ApexCharts) {
                            clearInterval(interval);
                            resolve();
                        }
                    }, 50);
                });
            }
        }
    }
    return apexScriptPromise;
};

export interface ApexChartProps {
    options: any;
    series: any[];
    style?: React.CSSProperties;
    className?: string;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const ApexChart: React.FC<ApexChartProps> = ({ options, series, style, className }) => {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const chartInstanceRef = useRef<any>(null);

    useEffect(() => {
        async function initChart() {
            await loadApexScript();

            if (!chartRef.current) {
                console.error("Chart container element not found");
                return;
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (!cWindow.ApexCharts) {
                console.error("ApexCharts is not loaded on cWindow!");
                return;
            }

            const chartOptions = {
                ...options,
                series: series,
            };

            try {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                chartInstanceRef.current = new cWindow.ApexCharts(chartRef.current, chartOptions);
                chartInstanceRef.current.render();
            } catch (err) {
                console.error("Error initializing ApexCharts:", err);
            }
        }

        initChart();

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, []);

    useEffect(() => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.updateSeries(series, true);
            chartInstanceRef.current.updateOptions(options, true);
        }
    }, [options, series]);

    return <div ref={chartRef} style={style} className={className} />;
};

export default ApexChart;