import { CallbackOnDataArrived, CallbackOnDataSended, CallbackOnDataSending, CallbackOnMessageService, ChunkInfo, IdType, MessageType, ServiceMessage, TypeOfData } from "ermes-types";

import { ErmesServiceInput, IErmesMessageControlService, IErmesStorageAndCaching } from "iermes/index";
import { IErmesRepository, IErmesService } from "iermes/standard-interface/IErmes";
import { ErmesReadRepo } from "./ErmesReadRepo.js";
import { ErmesSendRepo } from "./ErmesSendRepo.js";
import { createMessageDataErmes, DEFAULT_MAX_SIZE } from "../utility.js";

/** Error message when requested data is not found in storage */
const DATA_NOT_FOUND: Uint8Array = new TextEncoder().encode("DATA NOT FOUND");
/** Error message when storage is not enabled */
const NO_STORAGE_ENABLE: Uint8Array = new TextEncoder().encode("NO STORAGE ENABLE");

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
export class ErmesService implements IErmesService{
    /** Underlying transport repository */
    private _repository: IErmesRepository
    /** Handler for message sending */
    protected ermesSendRepo: ErmesSendRepo;
    /** Handler for message receiving */
    protected ermesReadRepo: ErmesReadRepo;
    /** Optional service for message storage and caching */
    protected ermesStorageAndCaching?: IErmesStorageAndCaching<MessageType>;
    /** Service for missing message control */
    protected ermesMessageControlService?: IErmesMessageControlService;
    /** Timer for periodic missing message checks */
    private missingMessagesInterval?: NodeJS.Timeout;
    /** Minimum threshold of missing IDs to trigger automatic requests */
    private missingMessagesThreshold?: number;
    
    // Local callbacks for user notifications
    /** Callback called before sending a message */
    private _callbackOnDataSending?: CallbackOnDataSending;
    /** Callback called after sending a message */
    private _callbackOnDataSended?: CallbackOnDataSended;

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
    constructor({
            maxBuffer,
            maxByte,
            repository,
            idHandler,
            callbackOnDataArrived,
            ermesStorageAndCaching,
            ermesMessageControlService,
            missingMessagesCheckIntervalMs,
            missingMessagesThreshold
            }: ErmesServiceInput
        ){
        this._repository = repository;
        this.ermesMessageControlService = ermesMessageControlService;
        this.missingMessagesThreshold = missingMessagesThreshold;
        
        // Maximum message size validation
        if((maxByte ?? DEFAULT_MAX_SIZE) > DEFAULT_MAX_SIZE)
            throw new Error(`maxByte cannot exceed ${DEFAULT_MAX_SIZE}`);
            
        // Initialize send and receive handlers
        this.ermesSendRepo = new ErmesSendRepo(repository, idHandler, maxByte ?? DEFAULT_MAX_SIZE)
        this.ermesReadRepo = new ErmesReadRepo(repository, this.handleServiceMessage, ermesMessageControlService,
            {
                callbackOnDataArrived,
                maxBufferSize: maxBuffer ?? 100,
                // Callback for threshold control after each received message
                callbackOnMessageProcessed: this.checkAndRequestMissingMessages.bind(this)
            })
            
        // Connect storage with send callback if available
        if(this.ermesStorageAndCaching !== undefined)
            this.ermesSendRepo.setCallbackOnDataSending(this.ermesStorageAndCaching.store);
        this.ermesStorageAndCaching = ermesStorageAndCaching;
        
        // Automatic start of periodic missing message control if configured
        if (missingMessagesCheckIntervalMs && ermesMessageControlService) {
            this.startMissingMessagesCheck(missingMessagesCheckIntervalMs);
        }
    }

    /**
     * Set callback for pre-send notification
     * 
     * @param callback Function called before sending each message
     */
    onDataSending(callback: CallbackOnDataSending): void {
        this._callbackOnDataSending = callback;
    }
    
    /**
     * Set callback for post-send notification
     * 
     * @param callback Function called after sending each message
     */
    onDataSended(callback: CallbackOnDataSended): void {
        this._callbackOnDataSended = callback;
    }

    /**
     * Replace the transport repository
     * 
     * @param repository New transport repository
     */
    setRepository(repository: IErmesRepository): void {
        this._repository = repository;
    }
    
    /**
     * Check if the connection is closed
     * 
     * @returns true if the connection is closed
     */
    isClosed(): boolean {
        return this._repository.isClosed();
    }
    
    /**
     * Set the callback for incoming messages
     * 
     * @param messageCallback Function called for each received message
     */
    onMessage(messageCallback: CallbackOnDataArrived): void {
        this.ermesReadRepo.setMessageDataCallback(messageCallback);
    }

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
    private handleServiceMessage(mess: ServiceMessage): void{
        if(mess.reason === "x")
            return this._repository.destroy(true);
        if(mess.reason == "c")
            throw new Error("Not implemented")

        // If message contains an ID list, send the requested messages
        if(mess.arrayId !== undefined)
            this.sendMissingMessages(mess.arrayId)
    }

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
    private async handleMissingMessages(): Promise<void>{
        if(this.ermesMessageControlService === undefined) {
            return;
        }

        let ids = await this.otherPeerMissingMessages();
        if(ids.length > 0) {
            await this.sendMissingMessages(ids);
        }
    }

    /**
     * Start periodic missing message checks (TIME-BASED PATH)
     * 
     * Sets up a timer that calls handleMissingMessages() at regular intervals
     * to ensure missing messages are requested even if threshold-based 
     * control doesn't activate
     * 
     * @param intervalMs Interval in milliseconds between checks
     */
    startMissingMessagesCheck(intervalMs: number): void {
        if (this.missingMessagesInterval) {
            this.stopMissingMessagesCheck();
        }
        
        this.missingMessagesInterval = setInterval(async () => {
            try {
                await this.handleMissingMessages();
            } catch (error) {
                console.error('Error in periodic handleMissingMessages:', error);
            }
        }, intervalMs);
    }

    /**
     * Stop periodic missing message checks
     */
    stopMissingMessagesCheck(): void {
        if (this.missingMessagesInterval) {
            clearInterval(this.missingMessagesInterval);
            this.missingMessagesInterval = undefined;
        }
    }

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
    async checkAndRequestMissingMessages(): Promise<void> {
        if(this.ermesMessageControlService === undefined) {
            return;
        }

        // Check if we've reached the missing ID threshold
        const numberOfMissingIds = this.ermesMessageControlService.numberOfMissingIds();
        if (this.missingMessagesThreshold && numberOfMissingIds < this.missingMessagesThreshold) {
            return; // Not enough missing IDs to request
        }

        // If threshold reached or not configured, request missing messages
        await this.handleMissingMessages();
    }


    /**
     * Get the list of missing IDs that the peer should have
     * 
     * @returns Array of IDs missing from this node
     */
    private async otherPeerMissingMessages(): Promise<IdType[]>{
        if(this.ermesMessageControlService === undefined)
            return [];
        return this.ermesMessageControlService.idsToRequest();
    }

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
    private async sendMissingMessages(arrayId: IdType[]){
        let items: MessageType[] = [];
        for(const id of arrayId){
            // If storage is not enabled, send error message
            if(this.ermesStorageAndCaching === undefined){
                items.push(createMessageDataErmes(NO_STORAGE_ENABLE, id));
                continue;
            }
            
            // Search for message in storage
            const mess = await this.ermesStorageAndCaching.retrieve(id);
            // If message is not found, send error message
            if(mess === undefined){
                items.push(createMessageDataErmes(DATA_NOT_FOUND, id));
                continue;
            }
            items.push(mess);
        }
        
        if(items.length === 0)
            throw new Error("Error during sendMissingBaseMessage, empty items array");
            
        // Send all messages together
        this.ermesSendRepo.sendMessageType(items);
    }

    /**
     * Main public method for sending user data
     * 
     * Handles pre/post send callbacks and delegates to ErmesSendRepo
     * 
     * @param message Data to send to peer
     */
    send(message: TypeOfData): void {
        // Pre-send callback
        if (this._callbackOnDataSending) {
            this._callbackOnDataSending(message);
        }
        
        // Actual sending
        this.ermesSendRepo.send(message);
        
        // Post-send callback
        if (this._callbackOnDataSended) {
            this._callbackOnDataSended(message);
        }
    }

    /**
     * Close the connection and stop all processes
     */
    close(){
        this.stopMissingMessagesCheck();
        this._repository.destroy(false);
    }

    /**
     * Check if the connection is active
     * 
     * @returns true if connected
     */
    isConnected(): boolean{
        return this._repository.isConnected();
    }

    /**
     * Wait for the connection to be established
     * 
     * @returns Promise that resolves when connected
     */
    waitForConnect(): Promise<void> {
        return this._repository.waitForConnect();
    }

    /**
     * Wait for the connection to close
     * 
     * @returns Promise that resolves when disconnected
     */
    waitForClose(): Promise<void> {
        return this._repository.waitForClose();
    }
}
