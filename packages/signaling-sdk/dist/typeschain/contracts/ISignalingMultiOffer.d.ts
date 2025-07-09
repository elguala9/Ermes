import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "../common";
export type SignalStruct = {
    signal: BytesLike;
    creationTime: BigNumberish;
};
export type SignalStructOutput = [signal: string, creationTime: bigint] & {
    signal: string;
    creationTime: bigint;
};
export interface ISignalingMultiOfferInterface extends Interface {
    getFunction(nameOrSignature: "getAnswer" | "getOffer" | "setAnswer" | "setOffer"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "proposeAnswer" | "proposeOffer"): EventFragment;
    encodeFunctionData(functionFragment: "getAnswer", values: [AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "getOffer", values: [AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "setAnswer", values: [BytesLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "setOffer", values: [BytesLike, AddressLike]): string;
    decodeFunctionResult(functionFragment: "getAnswer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getOffer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setAnswer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setOffer", data: BytesLike): Result;
}
export declare namespace proposeAnswerEvent {
    type InputTuple = [
        offerer: AddressLike,
        answerer: AddressLike,
        answer: SignalStruct
    ];
    type OutputTuple = [
        offerer: string,
        answerer: string,
        answer: SignalStructOutput
    ];
    interface OutputObject {
        offerer: string;
        answerer: string;
        answer: SignalStructOutput;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace proposeOfferEvent {
    type InputTuple = [
        peer: AddressLike,
        offerer: AddressLike,
        offer: SignalStruct
    ];
    type OutputTuple = [
        peer: string,
        offerer: string,
        offer: SignalStructOutput
    ];
    interface OutputObject {
        peer: string;
        offerer: string;
        offer: SignalStructOutput;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface ISignalingMultiOffer extends BaseContract {
    connect(runner?: ContractRunner | null): ISignalingMultiOffer;
    waitForDeployment(): Promise<this>;
    interface: ISignalingMultiOfferInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    getAnswer: TypedContractMethod<[
        offerer: AddressLike,
        answerer: AddressLike
    ], [
        SignalStructOutput
    ], "view">;
    getOffer: TypedContractMethod<[
        offerer: AddressLike,
        answerer: AddressLike
    ], [
        SignalStructOutput
    ], "view">;
    setAnswer: TypedContractMethod<[
        answer: BytesLike,
        peer: AddressLike
    ], [
        void
    ], "nonpayable">;
    setOffer: TypedContractMethod<[
        offer: BytesLike,
        peer: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "getAnswer"): TypedContractMethod<[
        offerer: AddressLike,
        answerer: AddressLike
    ], [
        SignalStructOutput
    ], "view">;
    getFunction(nameOrSignature: "getOffer"): TypedContractMethod<[
        offerer: AddressLike,
        answerer: AddressLike
    ], [
        SignalStructOutput
    ], "view">;
    getFunction(nameOrSignature: "setAnswer"): TypedContractMethod<[
        answer: BytesLike,
        peer: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "setOffer"): TypedContractMethod<[
        offer: BytesLike,
        peer: AddressLike
    ], [
        void
    ], "nonpayable">;
    getEvent(key: "proposeAnswer"): TypedContractEvent<proposeAnswerEvent.InputTuple, proposeAnswerEvent.OutputTuple, proposeAnswerEvent.OutputObject>;
    getEvent(key: "proposeOffer"): TypedContractEvent<proposeOfferEvent.InputTuple, proposeOfferEvent.OutputTuple, proposeOfferEvent.OutputObject>;
    filters: {
        "proposeAnswer(address,address,tuple)": TypedContractEvent<proposeAnswerEvent.InputTuple, proposeAnswerEvent.OutputTuple, proposeAnswerEvent.OutputObject>;
        proposeAnswer: TypedContractEvent<proposeAnswerEvent.InputTuple, proposeAnswerEvent.OutputTuple, proposeAnswerEvent.OutputObject>;
        "proposeOffer(address,address,tuple)": TypedContractEvent<proposeOfferEvent.InputTuple, proposeOfferEvent.OutputTuple, proposeOfferEvent.OutputObject>;
        proposeOffer: TypedContractEvent<proposeOfferEvent.InputTuple, proposeOfferEvent.OutputTuple, proposeOfferEvent.OutputObject>;
    };
}
