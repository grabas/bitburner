import React from "/lib/react";
import LineChart from "./LineChart";
import Label from "./AxisLabel";
import ChartTitle from "./ChartTitle";

interface ChartWrapperProps {
    title: string;
    data: { label: string; x: number; y: number }[];
    width?: number;
    height?: number;
    horizontalGuides?: number;
    verticalGuides?: number;
    precision?: number;
}

const styles = {
    chartComponentsContainer: {
        display: "grid",
        gridTemplateColumns: "max-content 700px",
        alignItems: "center",
    },
    chartWrapper: {
        maxWidth: 700,
        alignSelf: "flex-start",
    },
};

const ChartWrapper: React.FC<ChartWrapperProps> = ({
                                                       title,
                                                       data,
                                                       width = 250,
                                                       height = 150,
                                                       horizontalGuides = 5,
                                                       verticalGuides = 1,
                                                       precision = 2,
                                                   }) => {
    return (
        <div style={styles.chartComponentsContainer}>
            <div />
            <ChartTitle text={title} />
            <Label text="" rotate />
            <div style={styles.chartWrapper}>
                <LineChart
                    width={width}
                    height={height}
                    data={data}
                    horizontalGuides={horizontalGuides}
                    precision={precision}
                    verticalGuides={verticalGuides}
                />
            </div>
            <div />
            <Label text="" />
        </div>
    );
};

export default ChartWrapper;