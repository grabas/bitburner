import React from "/lib/react";

const STROKE = 1;

interface DataPoint {
    x: number;
    y: number;
    label: string;
}

interface LineChartProps {
    data: DataPoint[];
    height?: number;
    width?: number;
    horizontalGuides?: number;
    verticalGuides?: number | null;
    precision?: number;
}

const LineChart: React.FC<LineChartProps> = ({
                                                 data,
                                                 height = 100,
                                                 width = 250,
                                                 horizontalGuides = 4,
                                                 verticalGuides = null,
                                                 precision = 2
                                             }) => {
    const FONT_SIZE = width / 50;
    const maximumXFromData = Math.max(...data.map(e => e.x));
    const maximumYFromData = Math.max(...data.map(e => e.y));

    const digits = parseFloat(maximumYFromData.toString()).toFixed(precision).length + 1;

    const padding = (FONT_SIZE + digits) * 3;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const points = data
        .map(element => {
            const x = (element.x / maximumXFromData) * chartWidth + padding;
            const y = chartHeight - (element.y / maximumYFromData) * chartHeight + padding;
            return `${x},${y}`;
        })
        .join(" ");

    const Axis: React.FC<{ points: string }> = ({ points }) => (
        <polyline fill="none" stroke="#ccc" strokeWidth="0.5" points={points} />
    );

    const XAxis = () => (
        <Axis points={`${padding},${height - padding} ${width - padding},${height - padding}`} />
    );

    const YAxis = () => <Axis points={`${padding},${padding} ${padding},${height - padding}`} />;

    const VerticalGuides = () => {
        const guideCount = verticalGuides || data.length - 1;
        const startY = padding;
        const endY = height - padding;

        return (
            <React.Fragment>
                {new Array(guideCount).fill(0).map((_, index) => {
                    const ratio = (index + 1) / guideCount;
                    const xCoordinate = padding + ratio * (width - padding * 2);

                    return (
                        <polyline
                            key={index}
                            fill="none"
                            stroke="#ccc"
                            strokeWidth="0.5"
                            points={`${xCoordinate},${startY} ${xCoordinate},${endY}`}
                        />
                    );
                })}
            </React.Fragment>
        );
    };

    const HorizontalGuides = () => {
        const startX = padding;
        const endX = width - padding;

        return (
            <React.Fragment>
                {new Array(horizontalGuides).fill(0).map((_, index) => {
                    const ratio = (index + 1) / horizontalGuides;
                    const yCoordinate = chartHeight - chartHeight * ratio + padding;

                    return (
                        <polyline
                            key={index}
                            fill="none"
                            stroke="#ccc"
                            strokeWidth="0.5"
                            points={`${startX},${yCoordinate} ${endX},${yCoordinate}`}
                        />
                    );
                })}
            </React.Fragment>
        );
    };

    const LabelsXAxis = () => {
        const y = height - padding + FONT_SIZE * 2;

        return (
            <React.Fragment>
                {data.map((element, index) => {
                    const x = (element.x / maximumXFromData) * chartWidth + padding - FONT_SIZE / 2;

                    return (
                        <text
                            key={index}
                            x={x}
                            y={y}
                            style={{
                                fill: "#808080",
                                fontSize: FONT_SIZE,
                                fontFamily: "Helvetica"
                            }}
                        >
                            {element.label}
                        </text>
                    );
                })}
            </React.Fragment>
        );
    };

    const LabelsYAxis = () => {
        const PARTS = horizontalGuides;

        return (
            <React.Fragment>
                {new Array(PARTS + 1).fill(0).map((_, index) => {
                    const x = FONT_SIZE;
                    const ratio = index / horizontalGuides;
                    const yCoordinate = chartHeight - chartHeight * ratio + padding + FONT_SIZE / 2;

                    return (
                        <text
                            key={index}
                            x={x}
                            y={yCoordinate}
                            style={{
                                fill: "#808080",
                                fontSize: FONT_SIZE,
                                fontFamily: "Helvetica"
                            }}
                        >
                            {parseFloat((maximumYFromData * ratio).toFixed(precision))}
                        </text>
                    );
                })}
            </React.Fragment>
        );
    };

    return (
        <svg viewBox={`0 0 ${width} ${height}`}>
            <XAxis />
            <LabelsXAxis />
            <YAxis />
            <LabelsYAxis />
            {verticalGuides && <VerticalGuides />}
            <HorizontalGuides />

            <polyline fill="none" stroke="#0074d9" strokeWidth={STROKE} points={points} />
        </svg>
    );
};

export default LineChart;