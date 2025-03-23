import {Colors} from "/lib/enum/colors.enum";

export const setColor = (text: string|number|boolean, color: string): string => `${color}${text}${Colors.RESET}`;