import { useEffect } from "/react-component/react";
import { NS } from "@ns";
import {sleep} from "/lib/utils/sleep";

export const CLEAR_PORT_MSG = "CLEAR_PORT_MSG";

export type PortListenerCallback<T> = (newMessages: T[]) => void;

/**
 * A generic hook that listens to the given port and calls a callback with parsed messages.
 * @param ns - The NS instance.
 * @param portNumber - The port to listen to.
 * @param parseMessage - Function to convert a string message to type T.
 * @param callback - Function to handle the array of parsed messages.
 */
const usePortListener = <T>(
    ns: NS,
    portNumber: number,
    parseMessage: (msg: string) => T,
    callback: PortListenerCallback<T>
) => {
    useEffect(() => {
        let cancelled = false;
        async function pollPort() {
            const port = ns.getPortHandle(portNumber);
            let clearOnNextMessage = false;
            while (!cancelled) {
                const newMessages: T[] = [];
                let msg = port.read();
                while (msg !== "NULL PORT DATA") {
                    if (msg === CLEAR_PORT_MSG) {
                        clearOnNextMessage = true;
                        msg = port.read();
                        continue;
                    }
                    try {
                        if (clearOnNextMessage) {
                            // Signal to clear the current state.
                            callback([]);
                            clearOnNextMessage = false;
                        }
                        const parsed = parseMessage(msg);
                        newMessages.push(parsed);
                    } catch (err) {
                        ns.tprint("Error parsing message: " + err);
                    }
                    msg = port.read();
                }
                if (newMessages.length > 0) {
                    callback(newMessages);
                }
                await sleep(500);
            }
        }
        pollPort();
        return () => {
            cancelled = true;
        };
    }, [ns, portNumber, parseMessage, callback]);
};

export default usePortListener;