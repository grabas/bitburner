import React, { useEffect, useState } from "/react-component/react";
import ApexChart from "/react-component/chart/ApexChart";

interface LiveChartProps<T> {
    title: string;
    source: () => T[];
    transform: (data: T[]) => { x: number; y: number }[];
    refreshInterval?: number; // default to 1000ms if not provided
}

const LiveChart = <T,>({ title, source, transform, refreshInterval = 1000 }: LiveChartProps<T>) => {
    const [data, setData] = useState<{ x: number; y: number }[]>([]);

    useEffect(() => {
        const updateData = () => {
            const liveData = source();
            const transformed = transform(liveData);
            setData(transformed);
        };

        updateData(); // initial load
        const interval = setInterval(updateData, refreshInterval);
        return () => clearInterval(interval);
    }, [source, transform, refreshInterval]);

    const options = {
        chart: {
            type: "line",
            toolbar: { show: false },
        },
        xaxis: {
            type: "numeric",
        },
        responsive: [
            {
                breakpoint: 1000,
                options: {
                    plotOptions: {
                        bar: {
                            horizontal: false
                        }
                    },
                    legend: {
                        position: "bottom"
                    }
                }
            }
        ]
    };

    return <ApexChart options={options} series={[{ name: title, data }]} />;
};

export default LiveChart;