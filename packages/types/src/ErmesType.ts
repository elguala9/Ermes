//export type MessageContent = 't' | 'v' | 'i' | 'm' | 's'




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


export type MessageRoot<
    //MessageTypeGeneric extends MessageType,
    IntegrityCheckTypeGeneric extends IntegrityCheckType> = {

    messageSerialized: Uint8Array;
    integrityCheckValue: IntegrityCheckTypeGeneric; // refer to the content
}

export type InternalMessage<MessageTypeGeneric extends MessageType> = {

    message: MessageTypeGeneric;
    type: MessageValue; 
}

export type MessageWithId = {
    id: IdType;
}

// DataType is suggested to be ArrayBuffer
export type MessageData =  MessageDataGeneric<Uint8Array> & MessageWithId & {
}

// DataType is suggested to be ArrayBuffer
export type MessageDataGeneric<DataType> = MessageWithId & {
    data: DataType;
}

export type ChunkMessageGeneric<DataType> = MessageDataGeneric<DataType> & { //if i send the message in multiple pieces
    index: number; // index of the chunk
    roof: number; // number of all the pieces
}


export type ChunkMessage = ChunkMessageGeneric<Uint8Array> & { //if i send the message in multiple pieces

}


 // ----------------------------------------------------------
export type ServiceMessage = MessageWithId & {
    arrayChunkInfo?: ChunkInfo[];
    arrayId?: IdType[]; // id of theservice message
    reason: ServiceReason;
}


export type ChunkInfo = {
    index?: number[];
    chunkId: string; // id of the message of which the ServiceMessage is referring
} 

export type MessageRootErmes = MessageRoot<string>;
export type MessageDataErmes = MessageData;
export type MessageInternalErmes = InternalMessage<MessageType>;
export type MessageChunkErmes = ChunkMessage;