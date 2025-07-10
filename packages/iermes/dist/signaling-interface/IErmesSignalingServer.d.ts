export type SignalType = string;
/**
 * * Interface for a signaling server that allows setting and receiving signals.
 */
export interface IErmesSignalingServer {
    setSignal(signal: SignalType): void;
    onConnect(callback: () => void): void;
    onError(callback: (err: Error) => void): void;
    onClose(callback: () => void): void;
    onSignal(callback: (data: SignalType) => void): void;
}
