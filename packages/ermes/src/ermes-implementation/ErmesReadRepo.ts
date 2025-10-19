import { ObservableList } from "observable-list/src/ObservableList";
import { calculateHashSync } from "serialization-utility/src/Hash";
import { uint8ArrayToArrayBuffer, uint8ArrayToObject } from "serialization-utility/src/Serialization";

import { ChunkHandler } from "../ermes-utility/ChunkHandler.js";

import { CallbackOnDataArrived, CallBackServiceMessage, IdChunkType, InternalMessage, MessageChunkErmes, MessageDataErmes, MessageRoot, MessageType, MessageValue, SerializableDataType, ServiceMessage, TypeOfData } from "ermes-types";
import { IErmesMessageControlService, IErmesRepository } from "iermes/index";

/**
 * Type alias for MessageRoot with string type identifiers
 */
type MessageRootErmes = MessageRoot<string>;



/**
 * Configuration options for ErmesReadRepo
 */
export type ErmesReadRepoOptions = {
    /** Maximum size of the unread message buffer */
    maxBufferSize?: number,
    /** Callback called when new data arrives */
    callbackOnDataArrived?: CallbackOnDataArrived;
    /** Callback called after a message has been processed (for threshold checks) */
    callbackOnMessageProcessed?: () => Promise<void>;
}

/**
 * ErmesReadRepo - Handles message reception and processing
 * 
 * Main responsibilities:
 * - Message reception from transport repository
 * - Deserialization and integrity validation
 * - Chunk handling for large messages
 * - Automatic missing message control after each reception
 * - Buffer for messages not yet read by user
 */
export class ErmesReadRepo {
    /** Observable buffer of messages ready to be read by user */
    private readonly messageNotReaded: ObservableList<TypeOfData>;
    /** Map of chunks not yet completely assembled (chunk_id -> ChunkHandler) */
    private readonly messageNotMerged: Map<IdChunkType, ChunkHandler> = new Map<IdChunkType, ChunkHandler>();
    /** Transport repository for network communication */
    private readonly repository: IErmesRepository;
    /** Callback to handle service messages */
    private callbackServiceMessage: CallBackServiceMessage;
    /** Callback called when data is ready for user */
    private callbackOnDataArrived?: CallbackOnDataArrived;
    /** Callback called after processing each message (for missing checks) */
    private readonly callbackOnMessageProcessed?: () => Promise<void>;
    /** Service for missing message control */
    protected ermesMessageControlService?: IErmesMessageControlService;
    

    /**
     * ErmesReadRepo constructor
     * 
     * @param repository Transport repository for communication
     * @param callbackServiceMessage Callback to handle service messages (control, missing requests, etc.)
     * @param ermesMessageControlService Service to track and manage missing messages (optional)
     * @param options Configuration options (buffer size, callbacks, etc.)
     */
    constructor(
        repository: IErmesRepository, 
        callbackServiceMessage: CallBackServiceMessage,
        ermesMessageControlService: IErmesMessageControlService | undefined,
        {maxBufferSize, callbackOnDataArrived, callbackOnMessageProcessed}: ErmesReadRepoOptions){
            
        this.repository = repository;
        // Register handler for incoming messages from transport repository
        this.repository.onMessage(this.handleMessageArrayBuffer.bind(this)); // bind necessary to preserve context
        this.callbackServiceMessage = callbackServiceMessage;
        this.ermesMessageControlService = ermesMessageControlService;
        this.callbackOnMessageProcessed = callbackOnMessageProcessed;
        this.messageNotReaded = new ObservableList<TypeOfData>(maxBufferSize);
        this.callbackOnDataArrived = callbackOnDataArrived;
        
        // Configure observer for messages added to buffer
        // When a message is added, it's immediately passed to user via callback
        this.messageNotReaded.onAdd(()=>{
            if(this.callbackOnDataArrived){
                while(!this.messageNotReaded.isEmpty()){
                    let data: TypeOfData = this.messageNotReaded.shift();
                    this.callbackOnDataArrived(data);
                }
            }
        })
    }

    /**
     * Set callback for service messages
     * 
     * @param callbackServiceMessage Callback to handle control and service messages
     */
    public setCallbackServiceMessage(callbackServiceMessage: CallBackServiceMessage): void {
        this.callbackServiceMessage = callbackServiceMessage
    }

    /**
     * Set callback for incoming data
     * 
     * @param callback Function to call when data is ready for user
     */
    public setMessageDataCallback(callback: CallbackOnDataArrived): void{
        this.callbackOnDataArrived = callback;
    }

    /**
     * Main handler for raw messages received from transport repository
     * 
     * Processing phases:
     * 1. Validation of received message
     * 2. Deserialization of MessageRoot structure
     * 3. Integrity verification via hash
     * 4. Deserialization of internal message
     * 5. Routing to appropriate handler
     * 
     * @param message Raw data received from repository
     */
    private async handleMessageArrayBuffer(message: SerializableDataType): Promise<void>{
        try {
            // Basic validation: verify message is not empty or corrupted
            if (!message || (message instanceof Uint8Array && message.length === 0)) {
                console.warn('Received empty or invalid message');
                return;
            }
            
            // Deserialize outer message structure (contains hash + serialized data)
            let messRoot: MessageRootErmes = uint8ArrayToObject<MessageRootErmes>(message);
            let dataArrayBuffer = uint8ArrayToArrayBuffer(messRoot.messageSerialized)
            
            // Verify message integrity via hash
            if(messRoot.integrityCheckValue != calculateHashSync(dataArrayBuffer))
                throw new Error("Hash mismatched not implemented.");
                
            // Deserialize actual internal message
            let messageDeserialized: InternalMessage<MessageType> = uint8ArrayToObject(messRoot.messageSerialized)
            await this.handleMessageType(messageDeserialized);
        } catch (error) {
            console.error('Error processing message:', error);
            console.error('Message data:', message instanceof Uint8Array ? Array.from(message.slice(0, 50)) : message);
            // Don't rethrow error to avoid system crash
        }
    }

    /**
     * Handle routing of deserialized messages based on their type
     * 
     * Supported message types:
     * - service: control messages (missing requests, commands, etc.)
     * - base: simple data messages
     * - chunk: fragments of large messages
     * 
     * After processing, triggers automatic missing message control
     * 
     * @param mess Deserialized message with type and content
     */
    private async handleMessageType(mess: InternalMessage<MessageType>): Promise<void>{
        let messageType = mess.type;

        // Register message ID arrival in control system (if available)
        if (this.ermesMessageControlService) {
            this.ermesMessageControlService.idArrived(mess.message.id);
        }

        // Service messages have special handling (control, missing, etc.)
        if(messageType === MessageValue.service){
            this.callbackServiceMessage(mess.message as ServiceMessage);
            return;
        }

        // Handle data messages (base or chunk)
        this.handleMessage(mess.message, messageType);
        
        // After processing message, check if missing messages need to be requested
        // (this implements threshold-based control after each received message)
        if (this.callbackOnMessageProcessed) {
            try {
                await this.callbackOnMessageProcessed();
            } catch (error) {
                console.error('Error in callbackOnMessageProcessed:', error);
            }
        }
    }

    /**
     * Secondary router for data messages (non-service)
     * 
     * @param mess Message content
     * @param messageType Message type (base or chunk)
     */
    private handleMessage(mess: MessageType, messageType: MessageValue): void{
        if(messageType === MessageValue.base) 
            return this.handleBaseMessage(mess as MessageDataErmes);
        if(messageType === MessageValue.chunk) 
            return this.handleChunkMessage(mess as MessageChunkErmes);

        throw new Error("Message type not found" + messageType);
    }

    /**
     * Handle base messages (complete, non-fragmented)
     * Adds them directly to buffer for user
     * 
     * @param mess Complete data message
     */
    private handleBaseMessage(mess: MessageDataErmes): void{
        this.pushInNotReaded(mess.data);
    }

    /**
     * Handle chunks of fragmented messages
     * Assembles fragments progressively until completion
     * 
     * @param mess Message fragment with reference and position
     */
    private handleChunkMessage(mess: MessageChunkErmes): void{
        let res = this.messageNotMerged.get(mess.ref_id);
        // If this is the first chunk of this message, create a new ChunkHandler
        if(res == undefined){
            res = new ChunkHandler(mess.ref_id, mess.roof)
            this.messageNotMerged.set(mess.ref_id, res);
        }

        this.addChunk(res, mess);
    }

    /**
     * Add a chunk to ChunkHandler and check if message is complete
     * 
     * @param handler Chunk handler for this message
     * @param mess New chunk to add
     */
    private addChunk(handler: ChunkHandler, mess: MessageChunkErmes): void{
        let buffer = handler.addChunk(mess);
        // If message has been completely assembled
        if(buffer !== undefined){
            this.pushInNotReaded(buffer);
            // Remove handler from processing messages
            this.messageNotMerged.delete(mess.ref_id);
        }
    }

    /**
     * Add data to buffer of messages ready for user
     * Automatically triggers callback if configured
     * 
     * @param data Data ready to be consumed by user
     */
    private pushInNotReaded(data: TypeOfData): void{
        this.messageNotReaded.push(data);
    }
}
