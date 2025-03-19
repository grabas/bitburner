import React from "/lib/react";
import ChartWrapper from "/ui/chart/ChartWrapper";

interface LiveChartProps<T> {
    source: () => T[]; // A function that returns live data
    transform: (data: T[]) => { x: number; y: number }[]; // Data transformation
    refreshInterval?: number; // Optional refresh interval
}

const LiveChart = <T,>({ source, transform, refreshInterval = 1000 }: LiveChartProps<T>) => {
    const [data, setData] = React.useState<{ x: number; y: number }[]>([]);

    React.useEffect(() => {
        const updateData = () => setData(transform(source()));

        updateData(); // Initial load
        const interval = setInterval(updateData, refreshInterval);

        return () => clearInterval(interval);
    }, [source, transform, refreshInterval]);

    return <ChartWrapper data={data} />;
};

export default LiveChart;