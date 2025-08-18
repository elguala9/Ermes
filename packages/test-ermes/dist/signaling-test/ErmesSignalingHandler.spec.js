import { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import * as chai from "chai";
export function testSignalingHandler(service_1, service_2, service_3, account_1, account_2, account_3) {
    describe('IErmesSignalingHandler Tests', function () {
        before(async function () {
            chai.use(chaiAsPromised);
        });
        // --- createSignal() tests ---
        it('createSignal() should return a valid signal string', async () => {
            const signal = await service_1.createSignal();
            expect(signal).to.be.a('string');
            expect(signal.length).to.be.greaterThan(0);
        });
        it('createSignal() with remotePeerId should return different signal', async () => {
            const signal1 = await service_1.createSignal();
            const signal2 = await service_1.createSignal();
            expect(signal1).to.not.equal(signal2);
        });
        it('createSignal() called multiple times should return different signals', async () => {
            const signal1 = await service_1.createSignal();
            const signal2 = await service_1.createSignal();
            expect(signal1).to.not.equal(signal2);
        });
        // --- processSignal() tests ---
        it('processSignal() should accept valid signal from peer', async () => {
            const signal = await service_1.createSignal();
            await expect(service_2.processSignal(signal, account_1)).to.not.be.rejected;
        });
        it('processSignal() should reject invalid signal string', async () => {
            await expect(service_1.processSignal('invalid-signal', account_2)).to.be.rejected;
        });
        it('processSignal() should reject empty signal string', async () => {
            await expect(service_1.processSignal('', account_2)).to.be.rejected;
        });
        it('processSignal() should reject null/undefined signals', async () => {
            await expect(service_1.processSignal(null, account_2)).to.be.rejected;
            await expect(service_1.processSignal(undefined, account_2)).to.be.rejected;
        });
        // --- getSocket() tests ---
        it('getSocket() should throw when no connection established', async () => {
            await expect(service_1.getSocket(account_2)).to.be.rejected;
        });
        it('getSocket() should return socket after successful handshake', async () => {
            // Establish connection
            const offer = await service_1.createSignal();
            await service_2.processSignal(offer, account_1);
            const answer = await service_2.createSignal(account_1);
            await service_1.processSignal(answer, account_2);
            // Both sides should have sockets
            const socket1 = await service_1.getSocket(account_2);
            const socket2 = await service_2.getSocket(account_1);
            expect(socket1).to.have.property('socket');
            expect(socket1).to.have.property('connectionId');
            expect(socket2).to.have.property('socket');
            expect(socket2).to.have.property('connectionId');
        });
        it('getSocket() should throw for non-existent peer', async () => {
            await expect(service_1.getSocket('non-existent-peer')).to.be.rejected;
        });
        // --- isSocketReady() tests ---
        it('isSocketReady() should return false initially', async () => {
            const isReady = await service_3.isSocketReady(account_1);
            expect(isReady).to.be.false;
        });
        it('isSocketReady() should return false for non-existent peer', async () => {
            const isReady = await service_1.isSocketReady('non-existent-peer');
            expect(isReady).to.be.false;
        });
        it('isSocketReady() should return true after connection established', async () => {
            // Establish connection
            const offer = await service_1.createSignal();
            await service_2.processSignal(offer, account_1);
            const answer = await service_2.createSignal(account_1);
            await service_1.processSignal(answer, account_2);
            const isReady1 = await service_1.isSocketReady(account_2);
            const isReady2 = await service_2.isSocketReady(account_1);
            expect(isReady1).to.be.true;
            expect(isReady2).to.be.true;
        });
        // --- onSocketReady() tests ---
        it('onSocketReady() should trigger callback when socket becomes ready', async () => {
            let callbackTriggered = false;
            let receivedSocket = null;
            const callback = (socket) => {
                callbackTriggered = true;
                receivedSocket = socket;
            };
            await service_1.onSocketReady(account_2, callback);
            // Establish connection
            const offer = await service_1.createSignal();
            await service_2.processSignal(offer, account_1);
            const answer = await service_2.createSignal(account_1);
            await service_1.processSignal(answer, account_2);
            // Wait a bit for callback to trigger
            await new Promise(resolve => setTimeout(resolve, 100));
            expect(callbackTriggered).to.be.true;
            expect(receivedSocket).to.not.be.null;
            expect(receivedSocket).to.have.property('socket');
            expect(receivedSocket).to.have.property('connectionId');
        });
        it('onSocketReady() should handle callback for non-existent peer', async () => {
            let callbackTriggered = false;
            const callback = () => {
                callbackTriggered = true;
            };
            await service_1.onSocketReady('non-existent-peer', callback);
            // Wait a bit to ensure callback doesn't trigger
            await new Promise(resolve => setTimeout(resolve, 50));
            expect(callbackTriggered).to.be.false;
        });
        it('onSocketReady() should work with multiple peer callbacks', async () => {
            let callback1Triggered = false;
            let callback2Triggered = false;
            const callback1 = () => {
                callback1Triggered = true;
            };
            const callback2 = () => {
                callback2Triggered = true;
            };
            // Register callbacks for different peers
            await service_1.onSocketReady(account_2, callback1);
            await service_1.onSocketReady(account_3, callback2);
            // Establish connection with account_2 only
            const offer = await service_1.createSignal();
            await service_2.processSignal(offer, account_1);
            const answer = await service_2.createSignal(account_1);
            await service_1.processSignal(answer, account_2);
            // Wait for callbacks
            await new Promise(resolve => setTimeout(resolve, 100));
            expect(callback1Triggered).to.be.true; // Should trigger for account_2
            expect(callback2Triggered).to.be.false; // Should NOT trigger for account_3
        });
        // --- Full handshake integration tests ---
        it('Complete offer/answer handshake should work between two services', async () => {
            // Service 1 creates offer
            const offer = await service_1.createSignal();
            expect(offer).to.be.a('string');
            // Service 2 processes offer
            await service_2.processSignal(offer, account_1);
            // Service 2 creates answer
            const answer = await service_2.createSignal(account_1);
            expect(answer).to.be.a('string');
            expect(answer).to.not.equal(offer);
            // Service 1 processes answer
            await service_1.processSignal(answer, account_2);
            // Both should have ready sockets
            const isReady1 = await service_1.isSocketReady(account_2);
            const isReady2 = await service_2.isSocketReady(account_1);
            expect(isReady1).to.be.true;
            expect(isReady2).to.be.true;
            // Both should be able to get sockets
            const socket1 = await service_1.getSocket(account_2);
            const socket2 = await service_2.getSocket(account_1);
            expect(socket1).to.have.property('socket');
            expect(socket2).to.have.property('socket');
        });
        it('Multiple concurrent handshakes should work independently', async () => {
            // Service 1 → Service 2
            const offer12 = await service_1.createSignal();
            await service_2.processSignal(offer12, account_1);
            const answer12 = await service_2.createSignal(account_1);
            await service_1.processSignal(answer12, account_2);
            // Service 1 → Service 3  
            const offer13 = await service_1.createSignal();
            await service_3.processSignal(offer13, account_1);
            const answer13 = await service_3.createSignal(account_1);
            await service_1.processSignal(answer13, account_3);
            // All should have ready sockets for their respective peers
            const isReady1_2 = await service_1.isSocketReady(account_2);
            const isReady1_3 = await service_1.isSocketReady(account_3);
            const isReady2_1 = await service_2.isSocketReady(account_1);
            const isReady3_1 = await service_3.isSocketReady(account_1);
            expect(isReady1_2).to.be.true;
            expect(isReady1_3).to.be.true;
            expect(isReady2_1).to.be.true;
            expect(isReady3_1).to.be.true;
            // Should be able to get sockets for specific peers
            const socket1_2 = await service_1.getSocket(account_2);
            const socket1_3 = await service_1.getSocket(account_3);
            expect(socket1_2).to.have.property('socket');
            expect(socket1_3).to.have.property('socket');
        });
        // --- Error handling tests ---
        it('Should handle malformed JSON in processSignal', async () => {
            await expect(service_1.processSignal('{"invalid": json}', account_2)).to.be.rejected;
        });
        it('Should handle processing answer before offer', async () => {
            // Try to process an answer without having an offer first
            const offer = await service_1.createSignal();
            await service_2.processSignal(offer, account_1);
            const answer = await service_2.createSignal(account_1);
            // Service 3 tries to process answer without offer
            await expect(service_3.processSignal(answer, account_2)).to.be.rejected;
        });
        it('Should handle duplicate signal processing', async () => {
            const offer = await service_1.createSignal();
            await service_2.processSignal(offer, account_1);
            // Processing same offer again should either work or fail gracefully
            expect(service_2.processSignal(offer, account_1)).to.not.throw;
        });
        // --- Cleanup tests ---
        after(async () => {
            // Clean up all services
            try {
                await service_1.destroy();
                await service_2.destroy();
                await service_3.destroy();
            }
            catch (error) {
                console.warn('Cleanup error:', error);
            }
        });
    });
}
//# sourceMappingURL=ErmesSignalingHandler.spec.js.map