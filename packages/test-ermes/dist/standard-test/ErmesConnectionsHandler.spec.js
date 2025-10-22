import { expect } from 'chai';
export function testErmesConnectionsHandler(provider) {
    describe('ErmesConnectionsHandler Standard Tests (input-driven)', function () {
        let handler;
        let connection;
        let _cleanup;
        before('setup instances', async function () {
            const input = await provider();
            handler = input.handler;
            connection = input.connection;
            _cleanup = input.cleanup;
        });
        it('should add a connection successfully', function () {
            handler.addConnection(connection);
            const id = connection.getIdConnection();
            const retrieved = handler.getConnection(id);
            expect(retrieved).to.equal(connection);
        });
        it('should delete a connection and no longer retrieve it', function () {
            handler.addConnection(connection);
            const id = connection.getIdConnection();
            handler.deleteConnection(connection, false);
            let threw = false;
            try {
                handler.getConnection(id);
            }
            catch (err) {
                threw = true;
            }
            if (!threw)
                throw new Error('Expected getConnection to throw after deletion');
        });
        it('should throw when getting non-existent connection', function () {
            let threw = false;
            try {
                handler.getConnection('non-existent-peer');
            }
            catch (err) {
                threw = true;
            }
            if (!threw)
                throw new Error('Expected getConnection to throw for non-existent peer');
        });
        it('should save and load state without throwing', async function () {
            handler.addConnection(connection);
            await handler.saveState();
            await handler.loadState();
        });
        it('should handle loadState when no previous state exists', async function () {
            await handler.loadState();
        });

        after('cleanup resources', async function () {
            if (_cleanup && typeof _cleanup === 'function') {
                try {
                    await _cleanup();
                } catch (e) {
                    console.error('provider cleanup error', e);
                }
            }
        });
    });
}
//# sourceMappingURL=ErmesConnectionsHandler.spec.js.map