/**
 * * Interface that create and handle signaling of the peer
 */
export interface IErmesSignalingHandler<SignalDTO> {
    /**
     * create the signal (offer/answer) that will be passed to the other peer
     */
    createSignal(): Promise<SignalDTO>

    /**
     * create the signal (offer/answer) that will be passed to the other peer
     */
    createSignalString(): Promise<string>

    /**
     * 
     * @param signalString  signal (offer/answer) from the other peer as a string
     * @returns SignalData object parsed from the string
     */
    parseSignalString(signalString: string): SignalDTO 

}

