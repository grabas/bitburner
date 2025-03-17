import React from "/lib/react";

interface LabelProps {
    text: string;
    rotate?: boolean;
}

const style: React.CSSProperties = {
    display: "inline-block",
    width: "100%",
    textAlign: "center",
    color: "#808080",
};

const rotateStyles: React.CSSProperties = {
    transform: "rotate(-90deg)",
    width: 35,
    transformOrigin: "center",
    marginTop: 50,
    marginRight: 20,
};

const Label: React.FC<LabelProps> = ({ text, rotate }) => (
    <div>
        <span style={{ ...style, ...(rotate ? rotateStyles : {}) }}>{text}</span>
    </div>
);

export default Label;