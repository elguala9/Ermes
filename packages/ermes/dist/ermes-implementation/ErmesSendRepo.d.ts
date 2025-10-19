import { CallbackOnMessageSended, CallbackOnMessageSending, MessageRoot, MessageType, TypeOfData } from "ermes-types";
import { IErmesRepository, IIdHandlerService } from "iermes/index";
/**
 * Type alias for MessageRoot with string type identifiers
 */
export type MessageRootErmes = MessageRoot<string>;
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
export declare class ErmesSendRepo {
    /** Transport repository for actual sending */
    private readonly _repository;
    /** Maximum size of a single message (including headers) */
    private readonly _maxByte;
    /** Service for generating unique IDs */
    private readonly _idHandler;
    /** Callback called before sending (for storage/caching) */
    private callbackOnMessageSending?;
    /** Callback called after sending */
    private callbackOnMessageSended?;
    /**
     * ErmesSendRepo constructor
     *
     * @param repository Transport repository for sending messages
     * @param idHandler Service to generate unique IDs for messages
     * @param maxByte Maximum message size (default: 1024 bytes)
     */
    constructor(repository: IErmesRepository, idHandler: IIdHandlerService, maxByte?: number);
    /**
     * Set callback called before sending a message
     * Used mainly for storage/caching
     *
     * @param callback Function to call before sending
     */
    setCallbackOnDataSending(callback: CallbackOnMessageSending): void;
    /**
     * Set callback called after sending a message
     *
     * @param callback Function to call after sending
     */
    setCallbackOnDataSended(callback: CallbackOnMessageSended): void;
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
    send(rawData: TypeOfData): void;
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
    sendMessageType(array: MessageType[]): void;
    /**
     * Serialize and send a MessageRoot via transport repository
     *
     * @param message Root message with hash and data to send
     */
    private sendRootMessage;
    /**
     * Actual sending via transport repository
     *
     * Interface point with transport layer (WebRTC, WebSocket, etc.)
     * Future: implement retry logic and reception confirmations
     *
     * @param dataRaw Serialized data ready for sending
     */
    private sendWithRepo;
}
