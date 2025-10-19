import { CallbackOnDataArrived, CallBackServiceMessage } from "ermes-types";
import { IErmesMessageControlService, IErmesRepository } from "iermes/index";
/**
 * Configuration options for ErmesReadRepo
 */
export type ErmesReadRepoOptions = {
    /** Maximum size of the unread message buffer */
    maxBufferSize?: number;
    /** Callback called when new data arrives */
    callbackOnDataArrived?: CallbackOnDataArrived;
    /** Callback called after a message has been processed (for threshold checks) */
    callbackOnMessageProcessed?: () => Promise<void>;
};
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
export declare class ErmesReadRepo {
    /** Observable buffer of messages ready to be read by user */
    private readonly messageNotReaded;
    /** Map of chunks not yet completely assembled (chunk_id -> ChunkHandler) */
    private readonly messageNotMerged;
    /** Transport repository for network communication */
    private readonly repository;
    /** Callback to handle service messages */
    private callbackServiceMessage;
    /** Callback called when data is ready for user */
    private callbackOnDataArrived?;
    /** Callback called after processing each message (for missing checks) */
    private readonly callbackOnMessageProcessed?;
    /** Service for missing message control */
    protected ermesMessageControlService: IErmesMessageControlService;
    /**
     * ErmesReadRepo constructor
     *
     * @param repository Transport repository for communication
     * @param callbackServiceMessage Callback to handle service messages (control, missing requests, etc.)
     * @param ermesMessageControlService Service to track and manage missing messages
     * @param options Configuration options (buffer size, callbacks, etc.)
     */
    constructor(repository: IErmesRepository, callbackServiceMessage: CallBackServiceMessage, ermesMessageControlService: IErmesMessageControlService, { maxBufferSize, callbackOnDataArrived, callbackOnMessageProcessed }: ErmesReadRepoOptions);
    /**
     * Set callback for service messages
     *
     * @param callbackServiceMessage Callback to handle control and service messages
     */
    setCallbackServiceMessage(callbackServiceMessage: CallBackServiceMessage): void;
    /**
     * Set callback for incoming data
     *
     * @param callback Function to call when data is ready for user
     */
    setMessageDataCallback(callback: CallbackOnDataArrived): void;
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
    private handleMessageArrayBuffer;
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
    private handleMessageType;
    /**
     * Secondary router for data messages (non-service)
     *
     * @param mess Message content
     * @param messageType Message type (base or chunk)
     */
    private handleMessage;
    /**
     * Handle base messages (complete, non-fragmented)
     * Adds them directly to buffer for user
     *
     * @param mess Complete data message
     */
    private handleBaseMessage;
    /**
     * Handle chunks of fragmented messages
     * Assembles fragments progressively until completion
     *
     * @param mess Message fragment with reference and position
     */
    private handleChunkMessage;
    /**
     * Add a chunk to ChunkHandler and check if message is complete
     *
     * @param handler Chunk handler for this message
     * @param mess New chunk to add
     */
    private addChunk;
    /**
     * Add data to buffer of messages ready for user
     * Automatically triggers callback if configured
     *
     * @param data Data ready to be consumed by user
     */
    private pushInNotReaded;
}
