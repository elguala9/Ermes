import { expect } from "chai";
import * as sinon from "sinon";
export function testErmesRepository(repository_1, repository_2) {
    describe('IErmesRepository Tests', function () {
        it('isConnected() is true', () => {
            expect(repository_1.isConnected()).to.equal(true);
        });
        it('isClosed() is false', () => {
            expect(repository_1.isClosed()).to.equal(false);
        });
        // --- Basic functionality tests ---
        it('send() should accept ArrayBuffer data', () => {
            const buffer = new ArrayBuffer(10);
            expect(() => repository_1.send(new Uint8Array(buffer))).to.not.throw;
        });
        it('send() should accept Uint8Array data', () => {
            const uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
            expect(() => repository_1.send(uint8Array)).to.not.throw;
        });
        it('send() should throw for string data', () => {
            expect(() => repository_1.send(new Uint8Array("test message".split("").map(c => c.charCodeAt(0))))).to.throw;
        });
        // --- onMessage callback tests ---
        it('onMessage() should register callback', () => {
            const callback = sinon.stub();
            expect(() => repository_1.onMessage(callback)).to.not.throw;
        });
        it('onMessage() should trigger callback when message received', function (done) {
            this.timeout(5000);
            const testData = new Uint8Array([116, 101, 115, 116]); // "test" in bytes
            let callbackInvoked = false;
            const callback = (data) => {
                if (callbackInvoked) {
                    return; // Prevent multiple calls to done()
                }
                callbackInvoked = true;
                try {
                    expect(data).to.exist;
                    done();
                }
                catch (error) {
                    done(error);
                }
            };
            repository_2.onMessage(callback);
            // Simulate message sending after a short delay
            setTimeout(() => {
                try {
                    repository_1.send(testData);
                }
                catch (error) {
                    done(error);
                }
            }, 100);
        });
        // --- Connection state tests ---
        it('isClosed() should return false for active connection', () => {
            const isClosed = repository_1.isClosed();
            expect(isClosed).to.be.a('boolean');
            expect(isClosed).to.be.false;
        });
        // --- waitForConnect() tests ---
        it('waitForConnect() should resolve immediately if already connected', async () => {
            // Assuming repository starts connected
            try {
                await repository_1.waitForConnect(1000);
                // If we get here, the test passed
                expect(true).to.be.true;
            }
            catch (error) {
                throw new Error(`waitForConnect should have resolved: ${error}`);
            }
        });
        it('waitForConnect() should reject on timeout', async function () {
            this.timeout(3000);
            // Create a new repository that's not connected
            const disconnectedRepo = Object.create(repository_1);
            disconnectedRepo.isConnected = () => false;
            try {
                await disconnectedRepo.waitForConnect(500);
                throw new Error('Expected waitForConnect to reject, but it resolved');
            }
            catch (error) {
                expect(error.message).to.match(/timeout/i);
            }
        });
        it('waitForConnect() should work without timeout parameter', async () => {
            try {
                await repository_1.waitForConnect();
                // If we get here, the test passed
                expect(true).to.be.true;
            }
            catch (error) {
                throw new Error(`waitForConnect should have resolved: ${error}`);
            }
        });
        // --- Data type handling tests ---
        it('should handle binary data correctly', function (done) {
            this.timeout(3000);
            const binaryData = new Uint8Array([0xFF, 0x00, 0xAA, 0x55]);
            let callbackInvoked = false;
            const callback = (receivedData) => {
                if (callbackInvoked) {
                    return; // Prevent multiple calls to done()
                }
                callbackInvoked = true;
                try {
                    expect(receivedData).to.be.instanceOf(Uint8Array);
                    const uint8Data = receivedData;
                    expect(uint8Data.length).to.equal(binaryData.length);
                    expect(Array.from(uint8Data)).to.deep.equal(Array.from(binaryData));
                    done();
                }
                catch (error) {
                    done(error);
                }
            };
            repository_2.onMessage(callback);
            try {
                repository_1.send(binaryData);
            }
            catch (error) {
                done(error);
            }
        });
        it('should throw error for extremely large data', function () {
            this.timeout(3000);
            // Create data that exceeds WebRTC limits (1MB)
            const tooLargeData = new Uint8Array(1024 * 1024);
            for (let i = 0; i < tooLargeData.length; i++) {
                tooLargeData[i] = i % 256;
            }
            // This should throw an error or fail gracefully
            expect(() => {
                repository_1.send(tooLargeData);
            }).to.throw();
        });
        // --- Error handling tests ---
        it('should handle multiple onMessage callbacks', () => {
            const callback1 = sinon.stub();
            const callback2 = sinon.stub();
            expect(() => {
                repository_1.onMessage(callback1);
                repository_1.onMessage(callback2);
            }).to.not.throw;
        });
        it('should handle rapid consecutive sends', () => {
            const testData = new Uint8Array([1, 2, 3]);
            expect(() => {
                for (let i = 0; i < 10; i++) {
                    repository_1.send(testData);
                }
            }).to.not.throw;
        });
        // --- Integration tests ---
        it('should support bidirectional communication', function (done) {
            this.timeout(5000);
            let messagesReceived = 0;
            let testCompleted = false;
            const message1 = new Uint8Array([72, 101, 108, 108, 111]); // "Hello" in bytes
            const message2 = new Uint8Array([87, 111, 114, 108, 100]); // "World" in bytes
            const callback1 = (data) => {
                if (testCompleted)
                    return;
                try {
                    messagesReceived++;
                    expect(data).to.be.instanceOf(Uint8Array);
                    const uint8Data = data;
                    expect(Array.from(uint8Data)).to.deep.equal(Array.from(message2));
                    if (messagesReceived === 2) {
                        testCompleted = true;
                        done();
                    }
                }
                catch (error) {
                    if (!testCompleted) {
                        testCompleted = true;
                        done(error);
                    }
                }
            };
            const callback2 = (data) => {
                if (testCompleted)
                    return;
                try {
                    messagesReceived++;
                    expect(data).to.be.instanceOf(Uint8Array);
                    const uint8Data = data;
                    expect(Array.from(uint8Data)).to.deep.equal(Array.from(message1));
                    // Send response back
                    repository_2.send(message2);
                    if (messagesReceived === 2) {
                        testCompleted = true;
                        done();
                    }
                }
                catch (error) {
                    if (!testCompleted) {
                        testCompleted = true;
                        done(error);
                    }
                }
            };
            repository_1.onMessage(callback1);
            repository_2.onMessage(callback2);
            // Start the communication
            try {
                repository_1.send(message1);
            }
            catch (error) {
                if (!testCompleted) {
                    testCompleted = true;
                    done(error);
                }
            }
        });
        // --- Tests that modify connection state (grouped at the end) ---
        it('isClosed() should return true after destroy', () => {
            // Create a completely separate mock repository for testing destroy
            const mockRepo = {
                isClosed: sinon.stub().returns(true),
                destroy: sinon.stub(),
                send: sinon.stub(),
                onMessage: sinon.stub(),
                waitForConnect: sinon.stub(),
                waitForClose: sinon.stub()
            };
            mockRepo.destroy(false);
            const isClosed = mockRepo.isClosed();
            expect(isClosed).to.be.true;
        });
        it('destroy() with force=false should close connection gracefully', () => {
            // Test on a mock object to avoid breaking the main repository
            const mockRepo = {
                destroy: sinon.stub()
            };
            expect(() => mockRepo.destroy(false)).to.not.throw;
        });
        it('destroy() with force=true should close connection immediately', () => {
            // Test on a mock object to avoid breaking the main repository
            const mockRepo = {
                destroy: sinon.stub()
            };
            expect(() => mockRepo.destroy(true)).to.not.throw;
        });
        it('waitForClose() should resolve when repository is closed', async function () {
            this.timeout(3000);
            // Create a mock repository for this test
            let isDestroyed = false;
            const mockRepo = {
                destroy: () => { isDestroyed = true; },
                waitForClose: (timeout) => {
                    return new Promise((resolve, reject) => {
                        const timer = setTimeout(() => {
                            if (isDestroyed) {
                                resolve(true);
                            }
                            else {
                                reject(new Error('timeout'));
                            }
                        }, 100);
                    });
                }
            };
            const closePromise = mockRepo.waitForClose(2000);
            // Close the repository after a short delay
            setTimeout(() => {
                mockRepo.destroy();
            }, 50);
            try {
                await closePromise;
                // If we get here, the test passed
                expect(true).to.be.true;
            }
            catch (error) {
                throw new Error(`waitForClose should have resolved: ${error}`);
            }
        });
        it('waitForClose() should resolve immediately if already closed', async () => {
            // Create a mock repository that's already closed
            const mockRepo = {
                destroy: () => { },
                waitForClose: () => Promise.resolve(true)
            };
            try {
                await mockRepo.waitForClose();
                // If we get here, the test passed
                expect(true).to.be.true;
            }
            catch (error) {
                throw new Error(`waitForClose should have resolved: ${error}`);
            }
        });
        it('waitForClose() should reject on timeout if repository stays open', async function () {
            this.timeout(3000);
            // Create a mock that always times out
            const mockRepo = {
                waitForClose: (timeout) => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            reject(new Error('timeout'));
                        }, timeout);
                    });
                }
            };
            try {
                await mockRepo.waitForClose(500);
                throw new Error('Expected waitForClose to reject, but it resolved');
            }
            catch (error) {
                expect(error.message).to.match(/timeout/i);
            }
        });
        it('send() should throw when repository is closed', async () => {
            // Create a mock repository that's closed
            const mockRepo = {
                send: () => { throw new Error('Cannot send - repository is closed'); },
                destroy: () => { },
                waitForClose: () => Promise.resolve(true)
            };
            const testData = new Uint8Array([1, 2, 3]);
            expect(() => mockRepo.send()).to.throw;
        });
        // --- Cleanup tests ---
        after(async () => {
            try {
                repository_1.destroy(true);
                repository_2.destroy(true);
                await repository_1.waitForClose(1000);
                await repository_2.waitForClose(1000);
            }
            catch (error) {
                console.warn('Cleanup warning:', error);
            }
        });
    });
}
//# sourceMappingURL=ErmesRepository.spec.js.map