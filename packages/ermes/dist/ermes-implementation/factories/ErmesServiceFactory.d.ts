import { CallbackOnDataArrived, MessageType } from "ermes-types";
import { IErmesRepository, IIdHandlerService, IErmesStorageAndCaching } from "iermes/index";
import { ErmesService } from "../ErmesService.js";
/**
 * Factory configuration for creating ErmesService instances
 */
export interface ErmesServiceFactoryConfig {
    repository: IErmesRepository;
    idHandler: IIdHandlerService;
    callbackOnDataArrived?: CallbackOnDataArrived;
    maxByte?: number;
    maxBuffer?: number;
    ermesStorageAndCaching?: IErmesStorageAndCaching<MessageType>;
}
/**
 * Factory for creating ErmesService instances with various configurations
 */
export declare class ErmesServiceFactory {
    /**
     * Create a basic ErmesService with minimal configuration
     */
    static createBasic(repository: IErmesRepository, idHandler: IIdHandlerService): ErmesService;
    /**
     * Create an ErmesService with callback support
     */
    static createWithCallback(repository: IErmesRepository, idHandler: IIdHandlerService, callbackOnDataArrived: CallbackOnDataArrived): ErmesService;
    /**
     * Create an ErmesService with storage and caching
     */
    static createWithStorage(repository: IErmesRepository, idHandler: IIdHandlerService, storageAndCaching: IErmesStorageAndCaching<MessageType>, callbackOnDataArrived?: CallbackOnDataArrived): ErmesService;
    /**
     * Create an ErmesService with custom buffer and byte limits
     */
    static createWithLimits(repository: IErmesRepository, idHandler: IIdHandlerService, maxByte?: number, maxBuffer?: number, callbackOnDataArrived?: CallbackOnDataArrived): ErmesService;
    /**
     * Create a fully configured ErmesService
     */
    static createFull(config: ErmesServiceFactoryConfig): ErmesService;
    /**
     * Create an ErmesService with validation of parameters
     */
    static createWithValidation(config: ErmesServiceFactoryConfig): ErmesService;
    /**
     * Create multiple ErmesService instances for testing scenarios
     */
    static createPair(repository1: IErmesRepository, repository2: IErmesRepository, idHandler1: IIdHandlerService, idHandler2: IIdHandlerService, sharedConfig?: Partial<ErmesServiceFactoryConfig>): {
        service1: ErmesService;
        service2: ErmesService;
    };
    /**
     * Default configuration values
     */
    static get defaultConfig(): Partial<ErmesServiceFactoryConfig>;
}
