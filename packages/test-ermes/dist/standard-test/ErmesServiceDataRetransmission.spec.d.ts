import { IErmesService, IErmesMessageControlService, IErmesStorageAndCaching } from "iermes/index";
import { MessageType } from "ermes-types";
/**
 * Comprehensive tests for ErmesService data retransmission capabilities
 *
 * Tests cover:
 * - Missing message detection and automatic requests
 * - Periodic vs threshold-based retransmission control
 * - Storage integration for message persistence
 * - Service lifecycle with missing message control
 * - Error handling and edge cases
 */
export declare function testErmesServiceDataRetransmission(createServices: () => Promise<{
    service1: IErmesService;
    service2: IErmesService;
    messageControl1?: IErmesMessageControlService;
    messageControl2?: IErmesMessageControlService;
    storage1?: IErmesStorageAndCaching<MessageType>;
    storage2?: IErmesStorageAndCaching<MessageType>;
}>): void;
