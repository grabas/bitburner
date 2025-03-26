import React, { useState, useCallback, useMemo } from "/react-component/react";
import ApexChart from "../chart/ApexChart";
import { NS } from "@ns";
import usePortListener from "/react-component/hooks/use-port-listener";

interface StockData {
    timestamp: string;
    ask: number;
    price: number;
    bid: number;
}

interface StockCandle {
    x: number; // timestamp in ms for the bucket start
    y: [number, number, number, number]; // [open, high, low, close]
}

interface StockMonitorDashboardProps {
    ns: NS;
    portNumber: number;
    symbol: string;
}

// Define candle period (e.g., 10 seconds)
const CANDLE_PERIOD_MS = 10000;

// Aggregates raw stock data into candle data
const aggregateCandles = (data: StockData[]): StockCandle[] => {
    // Group prices by their time bucket
    const buckets: Record<number, number[]> = {};

    data.forEach((entry) => {
        const ts = new Date(entry.timestamp).getTime();
        const bucket = Math.floor(ts / CANDLE_PERIOD_MS) * CANDLE_PERIOD_MS;
        if (!buckets[bucket]) buckets[bucket] = [];
        buckets[bucket].push(entry.price);
    });

    // Build candle data for each bucket
    const candles: StockCandle[] = [];
    Object.keys(buckets).forEach((bucketKey) => {
        const bucket = Number(bucketKey);
        const prices = buckets[bucket];
        if (prices.length > 0) {
            const open = prices[0];
            const close = prices[prices.length - 1];
            const high = Math.max(...prices);
            const low = Math.min(...prices);
            candles.push({ x: bucket, y: [open, high, low, close] });
        }
    });

    // Sort candles by time ascending
    candles.sort((a, b) => a.x - b.x);
    return candles;
};

const StockMonitorCandlestickDashboard: React.FC<StockMonitorDashboardProps> = ({ ns, portNumber, symbol }) => {
    const [stockData, setStockData] = useState<StockData[]>([]);

    // Listen for new stock data coming through the NS port
    const handleMessages = useCallback((newMessages: StockData[]) => {
        if (newMessages.length === 0) {
            setStockData([]);
        } else {
            setStockData((prev) => [...prev, ...newMessages]);
        }
    }, []);

    usePortListener<StockData>(ns, portNumber, JSON.parse, handleMessages);

    // Convert raw stock data into candle chart data
    const candleData: StockCandle[] = useMemo(() => aggregateCandles(stockData), [stockData]);

    const chartOptions = {
        chart: {
            type: 'candlestick',
            animations: {
                enabled: true,
                easing: 'linear',
                dynamicAnimation: { speed: 1000 },
            },
            toolbar: {show: false},
        },
        xaxis: {
            type: 'datetime',
            title: { text: 'Time' },
            labels: {
                style: {
                    colors: "#fff",
                },
            },
        },
        yaxis: {
            title: { text: 'Price' },
            labels: {
                style: {
                    colors: "#fff",
                },
            },
        },
        title: {
            text: symbol,
            style: {
                color: "#fff",
            },
        },
        tooltip: {
            theme: "dark",
        },
    };

    const series = [
        { name: 'Stock Price', data: candleData }
    ];

    return (
        <div style={{ padding: "10px" }}>
            <ApexChart options={chartOptions} series={series} />
        </div>
    );
};

export default StockMonitorCandlestickDashboard;