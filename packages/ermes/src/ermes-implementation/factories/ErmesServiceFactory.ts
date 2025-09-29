import { CallbackOnDataArrived, MessageType } from "ermes-types";
import { 
    ErmesServiceInput, 
    IErmesRepository, 
    IIdHandlerService, 
    IErmesStorageAndCaching
} from "iermes/index";
import { ErmesService } from "../ErmesService.js";
import { DEFAULT_MAX_SIZE } from "../../utility.js";

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
export class ErmesServiceFactory {

    /**
     * Create a basic ErmesService with minimal configuration
     */
    static createBasic(
        repository: IErmesRepository, 
        idHandler: IIdHandlerService
    ): ErmesService {
        return new ErmesService({
            repository,
            idHandler
        });
    }

    /**
     * Create an ErmesService with callback support
     */
    static createWithCallback(
        repository: IErmesRepository, 
        idHandler: IIdHandlerService,
        callbackOnDataArrived: CallbackOnDataArrived
    ): ErmesService {
        return new ErmesService({
            repository,
            idHandler,
            callbackOnDataArrived
        });
    }

    /**
     * Create an ErmesService with storage and caching
     */
    static createWithStorage(
        repository: IErmesRepository, 
        idHandler: IIdHandlerService,
        storageAndCaching: IErmesStorageAndCaching<MessageType>,
        callbackOnDataArrived?: CallbackOnDataArrived
    ): ErmesService {
        return new ErmesService({
            repository,
            idHandler,
            callbackOnDataArrived,
            ermesStorageAndCaching: storageAndCaching
        });
    }

    /**
     * Create an ErmesService with custom buffer and byte limits
     */
    static createWithLimits(
        repository: IErmesRepository, 
        idHandler: IIdHandlerService,
        maxByte: number = DEFAULT_MAX_SIZE,
        maxBuffer: number = 100,
        callbackOnDataArrived?: CallbackOnDataArrived
    ): ErmesService {
        return new ErmesService({
            repository,
            idHandler,
            callbackOnDataArrived,
            maxByte,
            maxBuffer
        });
    }

    /**
     * Create a fully configured ErmesService
     */
    static createFull(config: ErmesServiceFactoryConfig): ErmesService {
        return new ErmesService({
            repository: config.repository,
            idHandler: config.idHandler,
            callbackOnDataArrived: config.callbackOnDataArrived,
            maxByte: config.maxByte,
            maxBuffer: config.maxBuffer,
            ermesStorageAndCaching: config.ermesStorageAndCaching
        });
    }

    /**
     * Create an ErmesService with validation of parameters
     */
    static createWithValidation(config: ErmesServiceFactoryConfig): ErmesService {
        // Validate maxByte doesn't exceed limit
        if (config.maxByte && config.maxByte > DEFAULT_MAX_SIZE) {
            throw new Error(`maxByte (${config.maxByte}) cannot exceed ${DEFAULT_MAX_SIZE}`);
        }

        // Validate maxBuffer is reasonable
        if (config.maxBuffer && (config.maxBuffer < 1 || config.maxBuffer > 10000)) {
            throw new Error(`maxBuffer (${config.maxBuffer}) should be between 1 and 10000`);
        }

        return this.createFull(config);
    }

    /**
     * Create multiple ErmesService instances for testing scenarios
     */
    static createPair(
        repository1: IErmesRepository,
        repository2: IErmesRepository,
        idHandler1: IIdHandlerService,
        idHandler2: IIdHandlerService,
        sharedConfig?: Partial<ErmesServiceFactoryConfig>
    ) {
        const service1 = new ErmesService({
            repository: repository1,
            idHandler: idHandler1,
            ...sharedConfig
        });

        const service2 = new ErmesService({
            repository: repository2,
            idHandler: idHandler2,
            ...sharedConfig
        });

        return {
            service1,
            service2
        };
    }

    /**
     * Default configuration values
     */
    static get defaultConfig(): Partial<ErmesServiceFactoryConfig> {
        return {
            maxByte: DEFAULT_MAX_SIZE,
            maxBuffer: 100
        };
    }
}