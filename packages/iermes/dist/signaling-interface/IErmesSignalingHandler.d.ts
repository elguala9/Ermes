/**
 * * Interface that create and handle signaling of the peer
 */
export interface IErmesSignalingHandler {
    /**
     * create the signal (offer/answer) that will be passed to the other peer
     */
    createSignal(): Promise<string>;
    /**
     *
     * @param signal  signal (offer/answer) from the other peer as a string
     */
    processSignal(signalString: string): Promise<void>;
}
