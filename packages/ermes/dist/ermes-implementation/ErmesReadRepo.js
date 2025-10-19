import { ObservableList } from "observable-list/src/ObservableList";
import { calculateHashSync } from "serialization-utility/src/Hash";
import { uint8ArrayToArrayBuffer, uint8ArrayToObject } from "serialization-utility/src/Serialization";
import { ChunkHandler } from "../ermes-utility/ChunkHandler.js";
import { MessageValue } from "ermes-types";
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
    /**
     * ErmesReadRepo constructor
     *
     * @param repository Transport repository for communication
     * @param callbackServiceMessage Callback to handle service messages (control, missing requests, etc.)
     * @param ermesMessageControlService Service to track and manage missing messages
     * @param options Configuration options (buffer size, callbacks, etc.)
     */
    constructor(repository, callbackServiceMessage, ermesMessageControlService, { maxBufferSize, callbackOnDataArrived, callbackOnMessageProcessed }) {
        /** Map of chunks not yet completely assembled (chunk_id -> ChunkHandler) */
        this.messageNotMerged = new Map();
        this.repository = repository;
        // Register handler for incoming messages from transport repository
        this.repository.onMessage(this.handleMessageArrayBuffer.bind(this)); // bind necessary to preserve context
        this.callbackServiceMessage = callbackServiceMessage;
        this.ermesMessageControlService = ermesMessageControlService;
        this.callbackOnMessageProcessed = callbackOnMessageProcessed;
        this.messageNotReaded = new ObservableList(maxBufferSize);
        this.callbackOnDataArrived = callbackOnDataArrived;
        // Configure observer for messages added to buffer
        // When a message is added, it's immediately passed to user via callback
        this.messageNotReaded.onAdd(() => {
            if (this.callbackOnDataArrived) {
                while (!this.messageNotReaded.isEmpty()) {
                    let data = this.messageNotReaded.shift();
                    this.callbackOnDataArrived(data);
                }
            }
        });
    }
    /**
     * Set callback for service messages
     *
     * @param callbackServiceMessage Callback to handle control and service messages
     */
    setCallbackServiceMessage(callbackServiceMessage) {
        this.callbackServiceMessage = callbackServiceMessage;
    }
    /**
     * Set callback for incoming data
     *
     * @param callback Function to call when data is ready for user
     */
    setMessageDataCallback(callback) {
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
    async handleMessageArrayBuffer(message) {
        try {
            // Basic validation: verify message is not empty or corrupted
            if (!message || (message instanceof Uint8Array && message.length === 0)) {
                console.warn('Received empty or invalid message');
                return;
            }
            // Deserialize outer message structure (contains hash + serialized data)
            let messRoot = uint8ArrayToObject(message);
            let dataArrayBuffer = uint8ArrayToArrayBuffer(messRoot.messageSerialized);
            // Verify message integrity via hash
            if (messRoot.integrityCheckValue != calculateHashSync(dataArrayBuffer))
                throw new Error("Hash mismatched not implemented.");
            // Deserialize actual internal message
            let messageDeserialized = uint8ArrayToObject(messRoot.messageSerialized);
            await this.handleMessageType(messageDeserialized);
        }
        catch (error) {
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
    async handleMessageType(mess) {
        let messageType = mess.type;
        // Register message ID arrival in control system
        this.ermesMessageControlService.idArrived(mess.message.id);
        // Service messages have special handling (control, missing, etc.)
        if (messageType === MessageValue.service) {
            this.callbackServiceMessage(mess.message);
            return;
        }
        // Handle data messages (base or chunk)
        this.handleMessage(mess.message, messageType);
        // After processing message, check if missing messages need to be requested
        // (this implements threshold-based control after each received message)
        if (this.callbackOnMessageProcessed) {
            try {
                await this.callbackOnMessageProcessed();
            }
            catch (error) {
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
    handleMessage(mess, messageType) {
        if (messageType === MessageValue.base)
            return this.handleBaseMessage(mess);
        if (messageType === MessageValue.chunk)
            return this.handleChunkMessage(mess);
        throw new Error("Message type not found" + messageType);
    }
    /**
     * Handle base messages (complete, non-fragmented)
     * Adds them directly to buffer for user
     *
     * @param mess Complete data message
     */
    handleBaseMessage(mess) {
        this.pushInNotReaded(mess.data);
    }
    /**
     * Handle chunks of fragmented messages
     * Assembles fragments progressively until completion
     *
     * @param mess Message fragment with reference and position
     */
    handleChunkMessage(mess) {
        let res = this.messageNotMerged.get(mess.ref_id);
        // If this is the first chunk of this message, create a new ChunkHandler
        if (res == undefined) {
            res = new ChunkHandler(mess.ref_id, mess.roof);
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
    addChunk(handler, mess) {
        let buffer = handler.addChunk(mess);
        // If message has been completely assembled
        if (buffer !== undefined) {
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
    pushInNotReaded(data) {
        this.messageNotReaded.push(data);
    }
}
//# sourceMappingURL=ErmesReadRepo.js.map