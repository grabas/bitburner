import {scheduler} from "/react-component/react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const sleep = (delay: number) => scheduler.postTask(() => {}, {delay});