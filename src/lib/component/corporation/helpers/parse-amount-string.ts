export function evaluateSellPrice(desiredSellPrice: string, marketPrice: number): number {
    if (desiredSellPrice.length === 0) {
        return marketPrice
    }

    if (desiredSellPrice.includes("MP")) {
        const expression = desiredSellPrice.replace(/MP/g, marketPrice.toString());
        try {
            return eval(expression);
        } catch (e) {
            console.error("Failed to evaluate expression:", expression, e);
            return NaN;
        }
    }

    return parseFloat(desiredSellPrice)
}