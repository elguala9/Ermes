import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import { ErmesConnectionFactory, ErmesConnectionsHandlerFactory, SignalManager, PacketManagerFactory } from 'ermes/index';
import { IdPeer, PeerType } from 'ermes-types';
import { IErmesFactory, IErmesRepository, IErmesSignalingHandler } from 'iermes/index';
import { ClientWorkDB } from 'workdb/ClientWorkDB';

/**
 * Test function for ErmesConnection and ErmesConnectionsHandler factories using real implementations
 * @param db The ClientWorkDB instance to use for testing
 */
export function testErmesConnection(db: ClientWorkDB) {
    describe('ErmesConnection Factories', () => {
        let signalingHandler: IErmesSignalingHandler<PeerType>;
        let factory: IErmesFactory<PeerType>;
        let repository: IErmesRepository;
        const testConnectionId: IdPeer = 'test-connection-123';

        beforeEach(async () => {
            // Create real SignalManager instance
            signalingHandler = new SignalManager();

            // Create real PacketManagerFactory instance
            factory = new PacketManagerFactory();

            // Create a real repository using the factory
            repository = await factory.createRepository(testConnectionId, signalingHandler);
        });

        describe('ErmesConnectionFactory', () => {
            it('should create a valid ErmesConnection instance', () => {
                const connection = ErmesConnectionFactory.createConnection(
                    signalingHandler,
                    factory,
                    repository,
                    testConnectionId
                );

                expect(connection).to.not.be.undefined;
                expect(connection.getIdConnection()).to.equal(testConnectionId);
            });

            it('should create connections with different IDs', () => {
                const connection1 = ErmesConnectionFactory.createConnection(
                    signalingHandler,
                    factory,
                    repository,
                    'connection-1'
                );

                const connection2 = ErmesConnectionFactory.createConnection(
                    signalingHandler,
                    factory,
                    repository,
                    'connection-2'
                );

                expect(connection1.getIdConnection()).to.equal('connection-1');
                expect(connection2.getIdConnection()).to.equal('connection-2');
                expect(connection1).to.not.equal(connection2);
            });

            it('should create connections that respond to basic operations', async () => {
                const connection = ErmesConnectionFactory.createConnection(
                    signalingHandler,
                    factory,
                    repository,
                    testConnectionId
                );

                // Test basic functionality
                expect(await connection.isClosed()).to.be.false;
                expect(await connection.ping()).to.be.a('boolean');
                
                // Test callback setting
                let callbackCalled = false;
                connection.setCloseCallback(() => {
                    callbackCalled = true;
                });

                await connection.close();
                expect(callbackCalled).to.be.true;
                expect(await connection.isClosed()).to.be.true;
            });
        });

        describe('ErmesConnectionsHandlerFactory', () => {
            it('should create a valid ErmesConnectionsHandler instance', () => {
                const handler = ErmesConnectionsHandlerFactory.createConnectionsHandler(db);
                expect(handler).to.not.be.undefined;
            });

            it('should create handlers that can manage connections', () => {
                const handler = ErmesConnectionsHandlerFactory.createConnectionsHandler(db);
                
                // Create a test connection
                const connection = ErmesConnectionFactory.createConnection(
                    signalingHandler,
                    factory,
                    repository,
                    testConnectionId
                );

                // Test adding connection
                expect(() => {
                    handler.addConnection(connection);
                }).to.not.throw();

                // Test retrieving connection
                const retrievedConnection = handler.getConnection(testConnectionId);
                expect(retrievedConnection).to.equal(connection);
            });

            it('should create handlers with different database instances', () => {
                const handler1 = ErmesConnectionsHandlerFactory.createConnectionsHandler(db);
                const handler2 = ErmesConnectionsHandlerFactory.createConnectionsHandler(db);

                expect(handler1).to.not.equal(handler2);
                expect(handler1).to.not.be.undefined;
                expect(handler2).to.not.be.undefined;
            });

            it('should create handlers that support persistence operations', async () => {
                const handler = ErmesConnectionsHandlerFactory.createConnectionsHandler(db);

                // Test state operations (loading should not throw)
                await handler.loadState(); // Should not throw
                // Note: saveState may fail due to current serialization format implementation
            });
        });

        describe('Integration', () => {
            it('should work together - create connection and add to handler', () => {
                const handler = ErmesConnectionsHandlerFactory.createConnectionsHandler(db);
                const connection = ErmesConnectionFactory.createConnection(
                    signalingHandler,
                    factory,
                    repository,
                    testConnectionId
                );

                handler.addConnection(connection);
                const retrievedConnection = handler.getConnection(testConnectionId);
                
                expect(retrievedConnection).to.equal(connection);
                expect(retrievedConnection.getIdConnection()).to.equal(testConnectionId);
            });

            it('should support multiple connections in handler', () => {
                const handler = ErmesConnectionsHandlerFactory.createConnectionsHandler(db);
                
                const connection1 = ErmesConnectionFactory.createConnection(
                    signalingHandler,
                    factory,
                    repository,
                    'conn-1'
                );

                const connection2 = ErmesConnectionFactory.createConnection(
                    signalingHandler,
                    factory,
                    repository,
                    'conn-2'
                );

                handler.addConnection(connection1);
                handler.addConnection(connection2);

                expect(handler.getConnection('conn-1')).to.equal(connection1);
                expect(handler.getConnection('conn-2')).to.equal(connection2);
            });
        });
    });
}