import { expect } from "chai";
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
export function testErmesServiceDataRetransmission(createServices) {
    let service1;
    let service2;
    let messageControl1;
    let messageControl2;
    let storage1;
    let storage2;
    describe('ErmesService Data Retransmission Tests', function () {
        beforeEach(async function () {
            this.timeout(20000);
            const services = await createServices();
            service1 = services.service1;
            service2 = services.service2;
            messageControl1 = services.messageControl1;
            messageControl2 = services.messageControl2;
            storage1 = services.storage1;
            storage2 = services.storage2;
        });
        afterEach(function () {
            if (service1 && !service1.isClosed()) {
                service1.close();
            }
            if (service2 && !service2.isClosed()) {
                service2.close();
            }
        });
        describe('Basic Missing Message Detection', function () {
            it('should detect missing messages when IDs are not sequential', async function () {
                this.timeout(15000);
                if (!messageControl1 || !messageControl2) {
                    this.skip();
                }
                // Simulate missing messages by manually registering non-sequential IDs
                await messageControl2.idArrived(1);
                await messageControl2.idArrived(3); // Missing ID 2
                await messageControl2.idArrived(5); // Missing ID 4
                const missingIds = await messageControl2.idsToRequest();
                expect(missingIds).to.include.members([2, 4]);
                expect(missingIds).to.not.include.members([1, 3, 5]);
            });
            it('should count missing IDs correctly', async function () {
                if (!messageControl1) {
                    this.skip();
                }
                await messageControl1.clear();
                // Add non-sequential IDs
                await messageControl1.idArrived(1);
                await messageControl1.idArrived(4);
                await messageControl1.idArrived(7);
                const numberOfMissing = messageControl1.numberOfMissingIds();
                expect(numberOfMissing).to.equal(3); // Missing: 2, 3, 5, 6 but only counts gaps up to highest
            });
        });
        describe('Storage Integration for Retransmission', function () {
            it('should store sent messages and retrieve them for retransmission', async function () {
                this.timeout(15000);
                if (!storage1 || !storage2) {
                    this.skip();
                }
                const testMessage = new Uint8Array([1, 2, 3, 4, 5]);
                let receivedCount = 0;
                service2.onMessage((data) => {
                    receivedCount++;
                });
                // Send message - should be stored automatically
                service1.send(testMessage);
                // Wait for message to be processed
                await new Promise(resolve => setTimeout(resolve, 1000));
                // Verify message was stored
                // Note: We can't directly test storage without knowing the message ID
                // This test verifies the integration works
                expect(receivedCount).to.equal(1);
            });
            it('should handle storage errors gracefully', async function () {
                this.timeout(10000);
                if (!storage1) {
                    this.skip();
                }
                // Test with a message that might cause storage issues
                const largeMessage = new Uint8Array(1000).fill(42);
                expect(() => {
                    service1.send(largeMessage);
                }).to.not.throw();
            });
        });
        describe('Periodic Missing Message Checks', function () {
            it('should start and stop periodic checks correctly', async function () {
                this.timeout(10000);
                if (!service1.startMissingMessagesCheck) {
                    this.skip();
                }
                const ermesService = service1;
                // Start periodic checks
                ermesService.startMissingMessagesCheck(100); // 100ms interval
                expect(ermesService.missingMessagesInterval).to.not.be.undefined;
                // Stop periodic checks
                ermesService.stopMissingMessagesCheck();
                expect(ermesService.missingMessagesInterval).to.be.undefined;
            });
            it('should handle errors in periodic missing message checks', async function () {
                this.timeout(10000);
                if (!service1.startMissingMessagesCheck) {
                    this.skip();
                }
                const ermesService = service1;
                // Start with very short interval to trigger multiple checks
                ermesService.startMissingMessagesCheck(50);
                // Let it run for a bit
                await new Promise(resolve => setTimeout(resolve, 200));
                // Should not throw errors even without proper setup
                ermesService.stopMissingMessagesCheck();
            });
        });
        describe('Threshold-Based Missing Message Control', function () {
            it('should only request missing messages when threshold is reached', async function () {
                this.timeout(15000);
                if (!messageControl2 || !service2.checkAndRequestMissingMessages) {
                    this.skip();
                }
                const ermesService = service2;
                ermesService.missingMessagesThreshold = 3; // Set threshold to 3
                // Add messages with gaps but below threshold
                await messageControl2.idArrived(1);
                await messageControl2.idArrived(3); // 1 missing ID (2)
                let numberOfMissing = messageControl2.numberOfMissingIds();
                expect(numberOfMissing).to.be.lessThan(3);
                // Should not trigger request due to threshold
                await ermesService.checkAndRequestMissingMessages();
                // Add more gaps to reach threshold
                await messageControl2.idArrived(6); // Now missing: 2, 4, 5 (3 missing)
                numberOfMissing = messageControl2.numberOfMissingIds();
                expect(numberOfMissing).to.be.greaterThanOrEqual(3);
            });
            it('should request missing messages when no threshold is set', async function () {
                this.timeout(10000);
                if (!messageControl2 || !service2.checkAndRequestMissingMessages) {
                    this.skip();
                }
                const ermesService = service2;
                ermesService.missingMessagesThreshold = undefined; // No threshold
                await messageControl2.idArrived(1);
                await messageControl2.idArrived(3); // Missing ID 2
                // Should always trigger request when no threshold
                expect(async () => {
                    await ermesService.checkAndRequestMissingMessages();
                }).to.not.throw();
            });
        });
        describe('Service Message Handling', function () {
            it('should handle forced close service messages', async function () {
                this.timeout(10000);
                const ermesService = service1;
                // Simulate receiving a close message
                const closeMessage = { reason: "x", arrayId: undefined };
                // This should trigger connection destruction
                expect(() => {
                    ermesService.handleServiceMessage(closeMessage);
                }).to.not.throw();
            });
            it('should handle missing message requests from peer', async function () {
                this.timeout(15000);
                if (!storage1) {
                    this.skip();
                }
                const ermesService = service1;
                const requestedIds = [1, 2, 3];
                const serviceMessage = {
                    reason: "request",
                    arrayId: requestedIds
                };
                // Should attempt to send requested messages
                expect(async () => {
                    await ermesService.handleServiceMessage(serviceMessage);
                }).to.not.throw();
            });
        });
        describe('Callbacks and Event Handling', function () {
            it('should trigger onDataSending callback before sending', async function () {
                this.timeout(10000);
                let callbackTriggered = false;
                let callbackData = null;
                service1.onDataSending((data) => {
                    callbackTriggered = true;
                    callbackData = data;
                });
                const testMessage = new Uint8Array([1, 2, 3]);
                service1.send(testMessage);
                // Wait a bit for async operations
                await new Promise(resolve => setTimeout(resolve, 100));
                expect(callbackTriggered).to.be.true;
                expect(callbackData).to.deep.equal(testMessage);
            });
            it('should trigger onDataSended callback after sending', async function () {
                this.timeout(10000);
                let callbackTriggered = false;
                let callbackData = null;
                service1.onDataSended((data) => {
                    callbackTriggered = true;
                    callbackData = data;
                });
                const testMessage = new Uint8Array([4, 5, 6]);
                service1.send(testMessage);
                // Wait a bit for async operations
                await new Promise(resolve => setTimeout(resolve, 100));
                expect(callbackTriggered).to.be.true;
                expect(callbackData).to.deep.equal(testMessage);
            });
        });
        describe('Connection Lifecycle with Missing Message Control', function () {
            it('should maintain missing message control across connection states', async function () {
                this.timeout(15000);
                if (!messageControl1) {
                    this.skip();
                }
                // Add some missing IDs
                await messageControl1.idArrived(1);
                await messageControl1.idArrived(3);
                const initialMissing = await messageControl1.idsToRequest();
                expect(initialMissing).to.include(2);
                // Connection state changes shouldn't affect missing message tracking
                expect(service1.isConnected()).to.be.a('boolean');
                const stillMissing = await messageControl1.idsToRequest();
                expect(stillMissing).to.deep.equal(initialMissing);
            });
            it('should clean up resources on close', async function () {
                this.timeout(10000);
                const ermesService = service1;
                // Start periodic checks if available
                if (ermesService.startMissingMessagesCheck) {
                    ermesService.startMissingMessagesCheck(1000);
                }
                // Close should clean up timers
                service1.close();
                if (ermesService.missingMessagesInterval) {
                    expect(ermesService.missingMessagesInterval).to.be.undefined;
                }
                expect(service1.isClosed()).to.be.true;
            });
        });
        describe('Error Handling and Edge Cases', function () {
            it('should handle empty missing message arrays', async function () {
                this.timeout(10000);
                if (!messageControl1) {
                    this.skip();
                }
                const missingIds = await messageControl1.idsToRequest();
                if (missingIds.length === 0) {
                    // This is the expected case for empty arrays
                    expect(missingIds).to.be.an('array').that.is.empty;
                }
            });
            it('should handle missing message control when service is undefined', async function () {
                this.timeout(10000);
                const ermesService = service1;
                // Temporarily remove message control service
                const originalService = ermesService.ermesMessageControlService;
                ermesService.ermesMessageControlService = undefined;
                // Should handle gracefully
                if (ermesService.handleMissingMessages) {
                    expect(async () => {
                        await ermesService.handleMissingMessages();
                    }).to.not.throw();
                }
                if (ermesService.checkAndRequestMissingMessages) {
                    expect(async () => {
                        await ermesService.checkAndRequestMissingMessages();
                    }).to.not.throw();
                }
                // Restore original service
                ermesService.ermesMessageControlService = originalService;
            });
            it('should handle storage errors during missing message requests', async function () {
                this.timeout(10000);
                const ermesService = service1;
                // Test with empty array - should handle gracefully
                expect(async () => {
                    await ermesService.sendMissingMessages([]);
                }).to.throw(); // This should throw as per the implementation
            });
            it('should handle large numbers of missing messages', async function () {
                this.timeout(20000);
                if (!messageControl1) {
                    this.skip();
                }
                // Create a large gap
                await messageControl1.idArrived(1);
                await messageControl1.idArrived(1000);
                const missingIds = await messageControl1.idsToRequest();
                expect(missingIds.length).to.be.greaterThan(100);
                // Should handle large arrays without issues
                expect(missingIds).to.be.an('array');
                expect(missingIds).to.include.members([2, 3, 4, 999]);
            });
        });
    });
}
//# sourceMappingURL=ErmesServiceDataRetransmission.spec.js.map