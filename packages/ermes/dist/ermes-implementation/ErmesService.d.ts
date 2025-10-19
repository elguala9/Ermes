import { CallbackOnDataArrived, CallbackOnDataSended, CallbackOnDataSending, MessageType, TypeOfData } from "ermes-types";
import { ErmesServiceInput, IErmesMessageControlService, IErmesStorageAndCaching } from "iermes/index";
import { IErmesRepository, IErmesService } from "iermes/standard-interface/IErmes";
import { ErmesReadRepo } from "./ErmesReadRepo.js";
import { ErmesSendRepo } from "./ErmesSendRepo.js";
/**
 * ErmesService - Main service for Ermes communication
 *
 * Main responsibilities:
 * - Coordination between ErmesSendRepo and ErmesReadRepo
 * - Automatic management of missing messages
 * - Integration with storage/caching for persistence
 * - Periodic and threshold-based control for missing requests
 * - Connection lifecycle management
 * - Public interface for end users
 */
export declare class ErmesService implements IErmesService {
    /** Underlying transport repository */
    private _repository;
    /** Handler for message sending */
    protected ermesSendRepo: ErmesSendRepo;
    /** Handler for message receiving */
    protected ermesReadRepo: ErmesReadRepo;
    /** Optional service for message storage and caching */
    protected ermesStorageAndCaching?: IErmesStorageAndCaching<MessageType>;
    /** Service for missing message control */
    protected ermesMessageControlService?: IErmesMessageControlService;
    /** Timer for periodic missing message checks */
    private missingMessagesInterval?;
    /** Minimum threshold of missing IDs to trigger automatic requests */
    private missingMessagesThreshold?;
    /** Callback called before sending a message */
    private _callbackOnDataSending?;
    /** Callback called after sending a message */
    private _callbackOnDataSended?;
    /**
     * ErmesService constructor
     *
     * Initializes all communication system components:
     * - Transport repository
     * - Send and receive handlers
     * - Optional services (storage, missing control)
     * - Automatic timers for periodic checks
     *
     * @param config Complete service configuration
     */
    constructor({ maxBuffer, maxByte, repository, idHandler, callbackOnDataArrived, ermesStorageAndCaching, ermesMessageControlService, missingMessagesCheckIntervalMs, missingMessagesThreshold }: ErmesServiceInput);
    /**
     * Set callback for pre-send notification
     *
     * @param callback Function called before sending each message
     */
    onDataSending(callback: CallbackOnDataSending): void;
    /**
     * Set callback for post-send notification
     *
     * @param callback Function called after sending each message
     */
    onDataSended(callback: CallbackOnDataSended): void;
    /**
     * Replace the transport repository
     *
     * @param repository New transport repository
     */
    setRepository(repository: IErmesRepository): void;
    /**
     * Check if the connection is closed
     *
     * @returns true if the connection is closed
     */
    isClosed(): boolean;
    /**
     * Set the callback for incoming messages
     *
     * @param messageCallback Function called for each received message
     */
    onMessage(messageCallback: CallbackOnDataArrived): void;
    /**
     * Handle service messages received from peer
     *
     * Service message types:
     * - "x": forced connection close request
     * - "c": control command (not implemented)
     * - With arrayId: request to send specific messages
     *
     * @param mess Received service message
     */
    private handleServiceMessage;
    /**
     * Handle missing message requests (PERIODIC CONTROL ONLY)
     *
     * This function is called by the periodic timer and does NOT check the threshold.
     * For threshold-based control, use checkAndRequestMissingMessages()
     *
     * Flow:
     * 1. Verify that control service is available
     * 2. Get list of missing IDs from peer
     * 3. Send request to peer if there are missing IDs
     */
    private handleMissingMessages;
    /**
     * Start periodic missing message checks (TIME-BASED PATH)
     *
     * Sets up a timer that calls handleMissingMessages() at regular intervals
     * to ensure missing messages are requested even if threshold-based
     * control doesn't activate
     *
     * @param intervalMs Interval in milliseconds between checks
     */
    startMissingMessagesCheck(intervalMs: number): void;
    /**
     * Stop periodic missing message checks
     */
    stopMissingMessagesCheck(): void;
    /**
     * Threshold-based missing message control (REACTIVE PATH)
     *
     * This function is called automatically after each received message.
     * Checks the missing ID threshold and requests only if necessary.
     *
     * Flow:
     * 1. Verify control service availability
     * 2. Count current missing IDs
     * 3. Compare with configured threshold
     * 4. If threshold reached, request missing messages
     *
     * NOTE: This is the "separate path" for intelligent control
     */
    checkAndRequestMissingMessages(): Promise<void>;
    /**
     * Get the list of missing IDs that the peer should have
     *
     * @returns Array of IDs missing from this node
     */
    private otherPeerMissingMessages;
    /**
     * Send messages requested by the peer
     *
     * For each requested ID:
     * 1. Check if storage is enabled
     * 2. Search for message in storage
     * 3. Send the message or an error message
     *
     * @param arrayId Array of message IDs to send
     */
    private sendMissingMessages;
    /**
     * Main public method for sending user data
     *
     * Handles pre/post send callbacks and delegates to ErmesSendRepo
     *
     * @param message Data to send to peer
     */
    send(message: TypeOfData): void;
    /**
     * Close the connection and stop all processes
     */
    close(): void;
    /**
     * Check if the connection is active
     *
     * @returns true if connected
     */
    isConnected(): boolean;
    /**
     * Wait for the connection to be established
     *
     * @returns Promise that resolves when connected
     */
    waitForConnect(): Promise<void>;
    /**
     * Wait for the connection to close
     *
     * @returns Promise that resolves when disconnected
     */
    waitForClose(): Promise<void>;
}
