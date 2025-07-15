export type SocketReadyCallback<SocketType> = (socket: SocketType) => void; 

/**
 * * Interface that create and handle signaling of the peer
 */
export interface IErmesSignalingHandler<SocketType>{
    /**
     * create the signal that will be passed to the other peer
     */
    createSignal(): Promise<string>;

    /**
     *
     * @param signal  signal from the other peer as a string
     */
    processSignal(signalString: string): Promise<void>;

    /**
     * return the socket of the signaling handler, if not ready it will throw an exception
     */
    getSocket(): Promise<SocketType>;

    /**
     * return true if the obj is ready to return a socket
     * @returns true if the socket is ready
    */
    isSocketReady(): Promise<boolean>;

    /**
     * set the callack called when the socket is ready
     * @param callback the callback called when the socket is ready
    */
    onSocketReady(callback: SocketReadyCallback<SocketType>): Promise<void>;

}

