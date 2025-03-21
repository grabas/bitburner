export const getProgressBar = (startTime: number, duration: number) => {
    const endTime = startTime + duration;
    const barWidth = 30;

    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    const remainingTime = endTime - currentTime;
    const percentComplete = elapsedTime / duration;
    const filledWidth = Math.floor(percentComplete * barWidth);
    const emptyWidth = barWidth - filledWidth;
    const bar = "[" + "=".repeat(filledWidth) + " ".repeat(emptyWidth) + "]";
    const timeRemaining = new Date(remainingTime).toISOString().substr(11, 8);

    return `${bar} ${Math.floor(percentComplete * 100)}%  \nRemaining:\t\t    ${timeRemaining}`;
}
