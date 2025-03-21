import {COLORS} from "/src/enum/colors.enum";

export const setColor = (text: string, color: string): string => `${color}${text}${COLORS.RESET}`;