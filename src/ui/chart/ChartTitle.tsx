import React from "/lib/react";

interface ChartTitleProps {
    text: string;
}

const ChartTitle: React.FC<ChartTitleProps> = ({ text }) => (
    <h3 style={{ textAlign: "center", marginBottom: "-1em", color: "#5a5a5a" }}>
        {text}
    </h3>
);

export default ChartTitle;