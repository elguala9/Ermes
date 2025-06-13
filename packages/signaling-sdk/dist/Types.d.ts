type InternalSignal = string;
export type OfferType = InternalSignal;
export type AnswerType = InternalSignal;
export type AddressType = string;
export type OutputStruct = {
    signal: InternalSignal;
    creationTime_EpochInSeconds: string;
};
export type CallbackSignal = (offerer: AddressType, answerer: AddressType, event: OutputStruct) => void;
export type OnAnswerInput = {
    callback: CallbackSignal;
    offererFilter?: AddressType;
    answererFilter?: AddressType;
};
export {};
