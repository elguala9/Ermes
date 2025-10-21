/**
 * Test function for ErmesConnectionsHandler
 * @param handler The ErmesConnectionsHandler instance to test (no mocks!)
 * @param connection Real IErmesConnection instance to use for testing
 */
export function testErmesConnectionsHandler(handler, connection) {
    console.log('Running ErmesConnectionsHandler Standard Tests...');
    // Connection Management Tests
    console.log('✓ should add a connection successfully');
    try {
        handler.addConnection(connection);
    }
    catch (error) {
        throw new Error(`Failed to add connection: ${error}`);
    }
    console.log('✓ should get a connection by peer ID');
    handler.addConnection(connection);
    const connectionId = connection.getIdConnection();
    const retrieved = handler.getConnection(connectionId);
    if (retrieved !== connection) {
        throw new Error('Failed to retrieve connection by ID');
    }
    console.log('✓ should delete a connection');
    handler.addConnection(connection);
    const connectionId2 = connection.getIdConnection();
    handler.deleteConnection(connection, false);
    try {
        handler.getConnection(connectionId2);
        throw new Error('Expected error when getting deleted connection');
    }
    catch (error) {
        // Expected error
    }
    console.log('✓ should throw error when getting non-existent connection');
    try {
        handler.getConnection('non-existent-peer');
        throw new Error('Expected error when getting non-existent connection');
    }
    catch (error) {
        // Expected error
    }
    // State Persistence Tests
    console.log('✓ should save state without errors');
    handler.addConnection(connection);
    handler.saveState().catch(error => {
        throw new Error(`Failed to save state: ${error}`);
    });
    console.log('✓ should load state without errors');
    handler.loadState().catch(error => {
        throw new Error(`Failed to load state: ${error}`);
    });
    console.log('✓ should handle load state when no previous state exists');
    handler.loadState().catch(error => {
        throw new Error(`Failed to load state when no previous state exists: ${error}`);
    });
    // Edge Cases Tests
    console.log('✓ should handle database save and load cycle');
    handler.addConnection(connection);
    handler.saveState().then(() => {
        return handler.loadState();
    }).then(() => {
        console.log('Database save and load cycle completed successfully');
    }).catch(error => {
        throw new Error(`Failed database save and load cycle: ${error}`);
    });
    console.log('All ErmesConnectionsHandler tests passed!');
}
//# sourceMappingURL=ErmesConnectionsHandler.spec.js.map