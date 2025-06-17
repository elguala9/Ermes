type InternalSignal = string;
export type OfferType = InternalSignal;
export type AnswerType = InternalSignal;
export type AddressType = string;
export type OutputStruct = {
    signal: InternalSignal;
    creationTime_EpochInSeconds: string;
};
export type CallbackSignalInput = {
    offerer: AddressType;
    answerer: AddressType;
    outputStruct: OutputStruct;
};
export type CallbackSignal = (input: CallbackSignalInput) => void;
export {};
