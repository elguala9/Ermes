//export type MessageContent = 't' | 'v' | 'i' | 'm' | 's'
import SimplePeer, {
  Options as PeerOptions,
  SignalData
} from 'simple-peer';



// b -> base message 
// c -> chunk 
// s -> service message
export enum MessageValue {
    base,
    chunk,
    service,
  }

// c -> completed
// s -> send again
// x -> closing connection
export type ServiceReason = 'c' | 's' | 'x'

// all the possbile message that can be sent
export type MessageType = MessageData | ChunkMessage | ServiceMessage

// every type that the integrity value can be
export type IntegrityCheckType = string | number | boolean 

// type of the id
export type IdType = number 

// id of the chunk
export type IdChunkType = string 

// this is the type used by the ermes service
export type TypeOfData = Uint8Array;

// this is the type used by the in the interfaces
export type TypeOfDataExternal = Uint8Array;

// the id of a peer
export type IdPeer = string;

export type MessageRoot<
    //MessageTypeGeneric extends MessageType,
    IntegrityCheckTypeGeneric extends IntegrityCheckType> = {

    messageSerialized: TypeOfData;
    integrityCheckValue: IntegrityCheckTypeGeneric; // refer to the content
}

export type InternalMessage<MessageTypeGeneric extends MessageType> = {

    message: MessageTypeGeneric;
    type: MessageValue; 
}

export type MessageWithId = {
    id: IdType;
}


export type MessageData =  MessageDataGeneric<TypeOfData> & MessageWithId & {
}


export type MessageDataGeneric<DataType> = MessageWithId & {
    data: DataType;
}

export type ChunkIndexType = number; // 8 bytes

export const MAX_HEADER = 81; // 24 bytes, ChunkMessageGeneric

export type ChunkMessageGeneric<DataType> = MessageDataGeneric<DataType> & { //24 bytes
    ref_id: IdChunkType; // 8 bytes
    index: ChunkIndexType; // 8 bytes
    roof: number; // 8 bytes
};

export type ChunkMessage = ChunkMessageGeneric<TypeOfData> & {};

export type ServiceMessage = MessageWithId & {
    arrayChunkInfo?: ChunkInfo[]; // 16 bytes each
    arrayId?: IdType[]; // 8 bytes each
    reason: ServiceReason; // 1 byte
};

export type ChunkInfo = { // 16 bytes
    index?: number[]; // 8 bytes each
    chunkId: ChunkIndexType;  // 8 bytes
};

export type MessageRootErmes = MessageRoot<string>;
export type MessageDataErmes = MessageData;
export type MessageInternalErmes = InternalMessage<MessageType>;
export type MessageChunkErmes = ChunkMessage;

export type CallBackServiceMessage = (serviceMessage: ServiceMessage) => void
export type CallbackOnMessageData = (serviceMessage: MessageDataErmes) => void


export type CallbackOnMessage = (message: MessageType) => void
export type CallbackOnData = (message: TypeOfData) => void

export type CallbackOnDataArrived = (data: TypeOfDataExternal) => void
export type CallbackOnDataArrivedFrom = (data: TypeOfDataExternal, peer: IdPeer) => void;
export type CallbackOnMessageSending = CallbackOnMessage
export type CallbackOnMessageSended = CallbackOnMessage
export type CallbackOnDataSending = CallbackOnData
export type CallbackOnDataSended = CallbackOnData
export type CallbackOnMessageReceived = {
    callbackonMessage: CallbackOnMessage;
    callbackOnData: CallbackOnDataArrived;
}

// this is the type used by the ermes repository
export type SerializableDataType = Uint8Array;

// here we ahve the data on webrtc
export type CallbackOnDataRepository = (data: SerializableDataType) => void;


// type of the callback when a message arrive
export type CallbackOnMessageService = (data: TypeOfData, messageWithId: MessageWithId) => void;

export type PeerType = SimplePeer.Instance;
