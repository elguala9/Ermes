import { IErmesConnection } from 'iermes/index';
import { ClientWorkDB } from 'workdb/ClientWorkDB';
type input = () => Promise<{
    db: ClientWorkDB;
    ermesConnections: IErmesConnection[];
}>;
/**
 * Input-driven spec: caller provides runtime instances via a provider function.
 * This allows Mocha to register tests at load time while the actual instances
 * are created in a runner (for example, in test-root) using real implementations.
 */
export declare function testErmesConnection(func: input): void;
export {};
