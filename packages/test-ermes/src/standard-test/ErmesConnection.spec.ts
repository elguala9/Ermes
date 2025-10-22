import { expect } from 'chai';
import { ErmesConnectionsHandlerFactory } from 'ermes/index';
import { IErmesConnection } from 'iermes/index';
// Do not import `describe`/`it` from 'mocha' at runtime — rely on Mocha-provided globals.
import { ClientWorkDB } from 'workdb/ClientWorkDB';


 type input = () => Promise<
 {
    db: ClientWorkDB;
    ermesConnections: IErmesConnection[];
}>;
/**
 * Input-driven spec: caller provides runtime instances via a provider function.
 * This allows Mocha to register tests at load time while the actual instances
 * are created in a runner (for example, in test-root) using real implementations.
 */
export function testErmesConnection(
    func: input
): void {
    describe('ErmesConnection Factories (input-driven)', function () {

    let db: ClientWorkDB;
    let ermesConnections: IErmesConnection[];

        let _cleanup: (() => Promise<void>) | undefined;

        before("before all tests", async function() {
            // Any async setup can be done here if needed
            const input = await func();
            db = input.db;
            ermesConnections = input.ermesConnections;
            // If provider returned a cleanup function, keep it for after()
            // support both sync and async cleanup functions
            if ((input as any).cleanup) {
                const maybe = (input as any).cleanup;
                _cleanup = async () => { await maybe(); };
            }
        });

        after("cleanup provided resources", async function() {
            if (_cleanup) {
                await _cleanup();
            }
        });

        it('has required input connections', function () {
            if (!ermesConnections || ermesConnections.length < 2) {
                throw new Error('testErmesConnection requires at least 2 ermesConnections passed in');
            }
        });

        // ErmesConnectionFactory
        it('testErmesConnection - should accept provided ErmesConnection instances', function () {
            const connection = ermesConnections[0];
            expect(connection).to.not.be.undefined;
            expect(connection.getIdConnection()).to.not.be.undefined;
        });

        it('testErmesConnection - should have distinct connections when provided', function () {
            const c1 = ermesConnections[0];
            const c2 = ermesConnections[1];
            expect(c1).to.not.equal(c2);
            expect(c1.getIdConnection()).to.not.equal(c2.getIdConnection());
        });

        it('testErmesConnection - should respond to basic operations on provided connection', async function () {
            const connection = ermesConnections[0];
            expect(await connection.isClosed()).to.be.a('boolean');
            expect(await connection.ping()).to.be.a('boolean');

            await connection.close();
            expect(await connection.isClosed()).to.be.true;
        });

        // ErmesConnectionsHandlerFactory
        it('ErmesConnectionsHandlerFactory - should create a valid ErmesConnectionsHandler instance', function () {
            const handler = ErmesConnectionsHandlerFactory.createConnectionsHandler(db);
            expect(handler).to.not.be.undefined;
        });

        it('ErmesConnectionsHandlerFactory - should manage provided connections', function () {
            const handler = ErmesConnectionsHandlerFactory.createConnectionsHandler(db);
            const connection = ermesConnections[0];
            handler.addConnection(connection);
            const retrieved = handler.getConnection(connection.getIdConnection());
            expect(retrieved).to.equal(connection);
        });

        it('ErmesConnectionsHandlerFactory - should create separate handlers for same DB config', function () {
            const handler1 = ErmesConnectionsHandlerFactory.createConnectionsHandler(db);
            const handler2 = ErmesConnectionsHandlerFactory.createConnectionsHandler(db);
            expect(handler1).to.not.equal(handler2);
        });

        it('ErmesConnectionsHandlerFactory - should support loadState without throwing', async function () {
            const handler = ErmesConnectionsHandlerFactory.createConnectionsHandler(db);
            await handler.loadState();
        });

        // Integration
        it('Integration - should add provided connection to handler and retrieve it', function () {
            const handler = ErmesConnectionsHandlerFactory.createConnectionsHandler(db);
            const connection = ermesConnections[0];
            handler.addConnection(connection);
            const retrieved = handler.getConnection(connection.getIdConnection());
            expect(retrieved).to.equal(connection);
        });

        it('Integration - should support multiple provided connections', function () {
            if (ermesConnections.length < 2) throw new Error('Need at least two connections for this test');
            const handler = ErmesConnectionsHandlerFactory.createConnectionsHandler(db);
            const c1 = ermesConnections[0];
            const c2 = ermesConnections[1];
            handler.addConnection(c1);
            handler.addConnection(c2);
            expect(handler.getConnection(c1.getIdConnection())).to.equal(c1);
            expect(handler.getConnection(c2.getIdConnection())).to.equal(c2);
        });

    });
}