import React, {cDocument} from "/lib/react";
import {uuidv4} from "/src/utils/uuidv4";

interface DraggableWindowProps {
    title?: string;
    children: React.ReactNode;
    containerId: string; // Unique ID for the container div
}

export const DraggableWindow = ({ title, children, containerId }: DraggableWindowProps) => {
    const [position, setPosition] = React.useState({ x: 200, y: 100 });
    const [size, setSize] = React.useState({ width: 500, height: 400 });
    const dragRef = React.useRef<HTMLDivElement | null>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        const startX = e.clientX;
        const startY = e.clientY;
        const startPos = { ...position };

        const handleMouseMove = (e: MouseEvent) => {
            setPosition({
                x: startPos.x + (e.clientX - startX),
                y: startPos.y + (e.clientY - startY),
            });
        };

        const handleMouseUp = () => {
            cDocument.removeEventListener("mousemove", handleMouseMove);
            cDocument.removeEventListener("mouseup", handleMouseUp);
        };

        cDocument.addEventListener("mousemove", handleMouseMove);
        cDocument.addEventListener("mouseup", handleMouseUp);
    };

    const handleResizeMouseDown = (e: React.MouseEvent) => {
        const startX = e.clientX;
        const startY = e.clientY;
        const startSize = { ...size };

        const handleMouseMove = (e: MouseEvent) => {
            setSize({
                width: Math.max(300, startSize.width + (e.clientX - startX)),
                height: Math.max(200, startSize.height + (e.clientY - startY)),
            });
        };

        const handleMouseUp = () => {
            cDocument.removeEventListener("mousemove", handleMouseMove);
            cDocument.removeEventListener("mouseup", handleMouseUp);
        };

        cDocument.addEventListener("mousemove", handleMouseMove);
        cDocument.addEventListener("mouseup", handleMouseUp);
    };

    const handleClose = () => {
        const container = cDocument.getElementById(containerId);
        if (container) {
            container.remove(); // Removes the entire div from the DOM
        }
    };

    return (
        <div
            ref={dragRef}
            style={{
                position: "fixed",
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: `${size.width}px`,
                height: `${size.height}px`,
            }}
        >
            <div onMouseDown={handleMouseDown} className="css-m1rlbi">
                <h6 className="css-45pnbq">{title || "Draggable"}</h6>

                <span
                    className="css-m1rlbi"
                    style={{
                        minWidth: "fit-content",
                        height: "33px",
                    }}
                >
                    <button
                        onClick={handleClose}
                        className="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium css-cw9z2a-titleButton"
                        tabIndex={0}
                        type="button"
                        title="Close window"
                    >
                        <svg
                            className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv"
                            focusable="false"
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            data-testid="CloseIcon"
                        >
                            <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                        </svg>
                        <span className="MuiTouchRipple-root css-w0pj6f"></span>
                    </button>
                </span>
            </div>
            <div className="css-1qhyy18-logs" style={{ height: "calc(100% - 33px)", display: "flex" }}>
                {children}
            </div>
            <span
                onMouseDown={handleResizeMouseDown}
                style={{
                    position: "absolute",
                    right: "-10px",
                    bottom: "-16px",
                    cursor: "nw-resize",
                    display: "inline-block",
                }}
            >
                <svg
                    className="MuiSvgIcon-root MuiSvgIcon-colorPrimary MuiSvgIcon-fontSizeMedium css-ley9l3"
                    focusable="false"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    data-testid="ArrowForwardIosIcon"
                    style={{ transform: "rotate(45deg)", fontSize: "1.75rem" }}
                >
                    <path d="M6.23 20.23 8 22l10-10L8 2 6.23 3.77 14.46 12z"></path>
                </svg>
            </span>
        </div>
    );
};