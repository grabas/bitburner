import React, { cDocument, cWindow } from "/lib/react";

export const ApexPlainChart: React.FC = () => {
    const chartRef = React.useRef<HTMLDivElement | null>(null);
    const apexChartInstanceRef = React.useRef<any>(null);

    React.useEffect(() => {
        // Wrap the async loading inside an inner function.
        async function loadAndRenderChart() {
            const apexSrc = "https://cdn.jsdelivr.net/npm/apexcharts";

            // Inject the script if it's not already present.
            if (!cDocument.querySelector(`script[src="${apexSrc}"]`)) {
                const script = cDocument.createElement("script");
                script.src = apexSrc;
                script.async = false;
                cDocument.head.appendChild(script);
                await new Promise<void>((resolve) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    script.onload = resolve;
                });
            }

            // Check if ApexCharts is available.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (!cWindow.ApexCharts) {
                console.error("ApexCharts is not loaded on cWindow! Did you inject the script?");
                return;
            }

            // Define your chart options.
            const options = {
                chart: { type: "line", height: 350 },
                series: [
                    {
                        name: "Sales",
                        data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
                    },
                ],
                xaxis: {
                    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
                },
            };

            // Create and render the chart.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            apexChartInstanceRef.current = new cWindow.ApexCharts(chartRef.current, options);
            apexChartInstanceRef.current.render();
        }

        loadAndRenderChart();

        // Cleanup: destroy the chart instance on unmount.
        return () => {
            if (apexChartInstanceRef.current) {
                apexChartInstanceRef.current.destroy();
            }
        };
    }, []);

    return (
        <div
            ref={chartRef}
            style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
            }}
        />
    );
};