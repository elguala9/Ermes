
import { CallbackOnMessageSended, CallbackOnMessageSending, ChunkMessage, IdChunkType, IdType, InternalMessage, MAX_HEADER, MessageDataErmes, MessageRoot, MessageType, SerializableDataType, TypeOfData } from "ermes-types";
import { IErmesRepository, IIdHandlerService } from "iermes/index";
import { calculateHashSync } from "serialization-utility/src/Hash";
import { objectToUint8Array, uint8ArrayToArrayBuffer } from "serialization-utility/src/Serialization";
import { v4 } from 'uuid';
import { chunkArrayBuffer, createMessageDataErmes, getMessageType } from "../utility.js";

/**
 * Type alias for MessageRoot with string type identifiers
 */
export type MessageRootErmes = MessageRoot<string>;

/**
 * Type alias for InternalMessage with MessageType
 */
type MessageInternalErmes = InternalMessage<MessageType>;

/**
 * Type alias for IErmesRepository 
 */
type NewType = IErmesRepository;

/**
 * ErmesSendRepo - Handles message sending and serialization
 * 
 * Main responsibilities:
 * - Serialization of user data into Ermes messages
 * - Automatic fragmentation for large messages  
 * - Calculation and addition of integrity hash
 * - Management of unique IDs via IdHandler
 * - Sending via transport repository
 * - Callbacks to notify user of sending
 */
export class ErmesSendRepo {
    /** Transport repository for actual sending */
    private readonly _repository: NewType
    /** Maximum size of a single message (including headers) */
    private readonly _maxByte: number;
    /** Service for generating unique IDs */
    private readonly _idHandler: IIdHandlerService
    /** Callback called before sending (for storage/caching) */
    private callbackOnMessageSending?: CallbackOnMessageSending;
    /** Callback called after sending */
    private callbackOnMessageSended?: CallbackOnMessageSended;

    /**
     * ErmesSendRepo constructor
     * 
     * @param repository Transport repository for sending messages
     * @param idHandler Service to generate unique IDs for messages
     * @param maxByte Maximum message size (default: 1024 bytes)
     */
    constructor(repository: IErmesRepository, idHandler: IIdHandlerService, maxByte: number = 1024){
        if(maxByte >= 1200)
            throw new Error("Max byte cannot be more that 1299")
        this._repository = repository;
        this._maxByte = maxByte + MAX_HEADER; // Add space for headers
        this._idHandler = idHandler;
    }

    /**
     * Set callback called before sending a message
     * Used mainly for storage/caching
     * 
     * @param callback Function to call before sending
     */
    public setCallbackOnDataSending(callback: CallbackOnMessageSending): void {
        this.callbackOnMessageSending = callback;
    }

    /**
     * Set callback called after sending a message
     * 
     * @param callback Function to call after sending
     */
    public setCallbackOnDataSended(callback: CallbackOnMessageSended): void {
        this.callbackOnMessageSended = callback;
    }

    /**
     * Main method for sending user data
     * 
     * Sending process:
     * 1. Generate unique ID for message
     * 2. Create MessageDataErmes with data
     * 3. Determine if fragmentation is needed
     * 4. Send message (whole or fragmented)
     * 
     * @param rawData Raw data to send
     */
    send(rawData: TypeOfData): void {
        
        // If data exceeds maximum size, fragmentation is necessary
        if(rawData.length > this._maxByte){
            // Generate unique ID for fragmented message
            let uuid = v4();
            let chunkedId: IdChunkType = uuid.toString();
            // Create chunk array with optimal size (300 byte margin for headers)
            let rawDataArray: ChunkMessage[] = chunkArrayBuffer(this._idHandler, rawData, chunkedId, this._maxByte - 300);
            
            // Notify callback for each chunk (for storage/caching)
            if (this.callbackOnMessageSending) {
                rawDataArray.forEach(chunk => this.callbackOnMessageSending!(chunk));
            }
            
            this.sendMessageType(rawDataArray);
            return; 
        }
        
        // Small message: direct sending without fragmentation
        let newId: IdType = this._idHandler.getNewId();
        let message: MessageDataErmes = createMessageDataErmes(rawData, newId);
        
        // Notify callback before sending (for storage/caching)
        if (this.callbackOnMessageSending) {
            this.callbackOnMessageSending(message);
        }
        
        this.sendMessageType([message]);
    }

    /**
     * Convert MessageType to root messages and send via repository
     * 
     * Serialization process:
     * 1. Create InternalMessage with type and content
     * 2. Serialize to Uint8Array
     * 3. Calculate integrity hash 
     * 4. Create MessageRoot with hash and data
     * 5. Serialize root and send
     * 
     * @param messageTypeArray Array of messages to send
     */
    public sendMessageType(array: MessageType[]): void {
        array.forEach(element => {
            // Create internal message with automatically determined type
            let internalMessage: MessageInternalErmes = {
                message: element,
                type: getMessageType(element)
            }
            
            // Serialize internal message
            let rawData: TypeOfData = objectToUint8Array(internalMessage);
            let rawDataArrayBuffer = uint8ArrayToArrayBuffer(rawData);
            
            // Notify pre-send callback (if not already done in send())
            if(this.callbackOnMessageSending !== undefined)
                this.callbackOnMessageSending(element);
                
            // Create root message with integrity hash
            let messageRoot: MessageRootErmes = {
                messageSerialized: rawData,
                integrityCheckValue: calculateHashSync(rawDataArrayBuffer)
            };
            
            // Send serialized root message
            this.sendRootMessage(messageRoot);
            
            // Notify post-send callback
            if(this.callbackOnMessageSended !== undefined)
                this.callbackOnMessageSended(element);
        }); 
    }

    /**
     * Serialize and send a MessageRoot via transport repository
     * 
     * @param message Root message with hash and data to send
     */
    private sendRootMessage(message: MessageRootErmes): void {
        let rawData = objectToUint8Array(message);
        this.sendWithRepo(rawData);       
    }

    /**
     * Actual sending via transport repository
     * 
     * Interface point with transport layer (WebRTC, WebSocket, etc.)
     * Future: implement retry logic and reception confirmations
     * 
     * @param dataRaw Serialized data ready for sending
     */
    private sendWithRepo(dataRaw: SerializableDataType): void {
        this._repository.send(dataRaw);
        
        // For now we assume sending is always successful
        // In a real implementation, should wait for confirmation
        // NOTE: In future implement message tracking and confirmations
    }    
}


