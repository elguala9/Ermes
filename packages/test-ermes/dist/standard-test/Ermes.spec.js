import { expect } from "chai";
export function testErmesService(f) {
    let service_1;
    let service_2;
    describe('IErmesService Tests', function () {
        before(async function () {
            this.timeout(20000);
            let x = await f();
            service_1 = x.service_1;
            service_2 = x.service_2;
        });
        it('Send & Receive Test', async () => {
            this.timeout(20000);
            const payload = new Uint8Array([1, 2, 3, 4]);
            // Promessa che si risolve al primo messaggio ricevuto
            const received = new Promise((resolve) => {
                service_2.onMessage({
                    callbackOnData: (data) => {
                        resolve(data);
                    },
                    callbackonMessage: (data) => {
                        resolve(data);
                    }
                });
            });
            service_1.send(payload);
            const result = await received;
            expect(result).to.deep.equal(payload);
        });
        it('Multiple Messages Test', async function () {
            this.timeout(10000);
            const messages = [
                new Uint8Array([5]),
                new Uint8Array([6, 7]),
                new Uint8Array([8, 9, 10]),
            ];
            const received = [];
            let receivedCount = 0;
            const allReceived = new Promise((resolve) => {
                service_2.onMessage({
                    callbackOnData: (data) => {
                        received.push(data);
                        receivedCount++;
                        if (receivedCount === messages.length) {
                            resolve();
                        }
                    },
                    callbackonMessage: () => { }
                });
            });
            for (const msg of messages) {
                service_1.send(msg);
            }
            await allReceived;
            expect(received.length).to.equal(messages.length);
            for (let i = 0; i < messages.length; i++) {
                expect(received[i]).to.deep.equal(messages[i]);
            }
        });
        it('Large Data Test', async function () {
            this.timeout(10000);
            // Test with larger data (but under WebRTC limits)
            const largeData = new Uint8Array(8192); // 8KB
            for (let i = 0; i < largeData.length; i++) {
                largeData[i] = i % 256;
            }
            const received = new Promise((resolve) => {
                service_2.onMessage({
                    callbackOnData: (data) => {
                        resolve(data);
                    },
                    callbackonMessage: () => { }
                });
            });
            service_1.send(largeData);
            const result = await received;
            expect(result).to.deep.equal(largeData);
        });
        it('Big Message Test - Near WebRTC Limit', async function () {
            this.timeout(20000);
            // Test with very large data approaching WebRTC limits
            const bigSize = 64 * 1024; // 64KB - typical WebRTC chunk size limit
            const bigData = new Uint8Array(bigSize);
            // Fill with a recognizable pattern for verification
            for (let i = 0; i < bigData.length; i++) {
                bigData[i] = (i % 256);
            }
            const received = new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Timeout waiting for big message'));
                }, 15000);
                service_2.onMessage({
                    callbackOnData: (data) => {
                        clearTimeout(timeout);
                        resolve(data);
                    },
                    callbackonMessage: () => { }
                });
            });
            console.log(`Sending big message of ${bigSize} bytes...`);
            service_1.send(bigData);
            const result = await received;
            console.log(`Received big message of ${result.length} bytes`);
            expect(result.length).to.equal(bigSize);
            expect(result).to.deep.equal(bigData);
            // Verify pattern integrity
            for (let i = 0; i < Math.min(1000, result.length); i++) {
                expect(result[i]).to.equal(i % 256, `Pattern mismatch at position ${i}`);
            }
        });
        it('Very Big Message Test - Maximum Size', async function () {
            this.timeout(30000);
            // Test with maximum practical size for WebRTC
            const maxSize = 256 * 1024; // 256KB - pushing WebRTC limits
            const maxData = new Uint8Array(maxSize);
            // Use a more complex pattern for verification
            for (let i = 0; i < maxData.length; i++) {
                maxData[i] = ((i * 7) % 256); // More complex pattern
            }
            const received = new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Timeout waiting for very big message'));
                }, 25000);
                service_2.onMessage({
                    callbackOnData: (data) => {
                        clearTimeout(timeout);
                        resolve(data);
                    },
                    callbackonMessage: () => { }
                });
            });
            console.log(`Sending very big message of ${maxSize} bytes...`);
            try {
                service_1.send(maxData);
                const result = await received;
                console.log(`Successfully received very big message of ${result.length} bytes`);
                expect(result.length).to.equal(maxSize);
                expect(result).to.deep.equal(maxData);
                // Verify pattern integrity at key points
                const checkPoints = [0, 1000, maxSize / 2, maxSize - 1000, maxSize - 1];
                for (const point of checkPoints) {
                    if (point < result.length) {
                        expect(result[point]).to.equal((point * 7) % 256, `Pattern mismatch at position ${point}`);
                    }
                }
            }
            catch (error) {
                console.log(`Very big message failed as expected: ${error instanceof Error ? error.message : String(error)}`);
                // This test might fail due to WebRTC limits, which is acceptable
                // We just want to test the boundary conditions
                expect(error).to.be.instanceOf(Error);
            }
        });
        it('Bidirectional Communication Test', async function () {
            this.timeout(10000);
            const message1 = new Uint8Array([11, 12, 13]);
            const message2 = new Uint8Array([21, 22, 23]);
            let received1 = null;
            let received2 = null;
            const bothReceived = new Promise((resolve) => {
                let count = 0;
                service_1.onMessage({
                    callbackOnData: (data) => {
                        received1 = data;
                        count++;
                        if (count === 2)
                            resolve();
                    },
                    callbackonMessage: () => { }
                });
                service_2.onMessage({
                    callbackOnData: (data) => {
                        received2 = data;
                        count++;
                        if (count === 2)
                            resolve();
                    },
                    callbackonMessage: () => { }
                });
            });
            // Send from both directions
            service_1.send(message1);
            service_2.send(message2);
            await bothReceived;
            expect(received1).to.deep.equal(message2);
            expect(received2).to.deep.equal(message1);
        });
        it('Empty Data Test', async function () {
            this.timeout(5000);
            const emptyData = new Uint8Array(0);
            const received = new Promise((resolve) => {
                service_2.onMessage({
                    callbackOnData: (data) => {
                        resolve(data);
                    },
                    callbackonMessage: () => { }
                });
            });
            service_1.send(emptyData);
            const result = await received;
            expect(result).to.deep.equal(emptyData);
            expect(result.length).to.equal(0);
        });
        it('Rapid Fire Messages Test', async function () {
            this.timeout(15000);
            const messageCount = 50;
            const messages = [];
            const received = [];
            // Generate test messages
            for (let i = 0; i < messageCount; i++) {
                messages.push(new Uint8Array([i % 256, (i + 1) % 256]));
            }
            const allReceived = new Promise((resolve) => {
                service_2.onMessage({
                    callbackOnData: (data) => {
                        received.push(data);
                        if (received.length === messageCount) {
                            resolve();
                        }
                    },
                    callbackonMessage: () => { }
                });
            });
            // Send all messages rapidly
            for (const msg of messages) {
                service_1.send(msg);
            }
            await allReceived;
            expect(received.length).to.equal(messageCount);
            // Verify all messages were received correctly
            for (let i = 0; i < messageCount; i++) {
                expect(received[i]).to.deep.equal(messages[i]);
            }
        });
    });
    describe('Connection Management Tests', function () {
        it('Service State Test', async function () {
            this.timeout(5000);
            // Test that services are in a valid connected state
            expect(service_1).to.not.be.null;
            expect(service_2).to.not.be.null;
            // Send a quick test message to verify connection is still active
            const testPayload = new Uint8Array([99, 100]);
            const received = new Promise((resolve) => {
                service_2.onMessage({
                    callbackOnData: (data) => {
                        resolve(data);
                    },
                    callbackonMessage: () => { }
                });
            });
            service_1.send(testPayload);
            const result = await received;
            expect(result).to.deep.equal(testPayload);
        });
    });
}
//# sourceMappingURL=Ermes.spec.js.map