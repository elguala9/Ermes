import { expect } from "chai";
import { IErmesService } from "iermes/index";

/**
 * Interface for controlling message failures
 */
interface IFailureController {
  setFailureRate(rate: number): void;
  setDropNextMessages(count: number): void;
  resetFailures(): void;
  getDroppedCount(): number;
  getSuccessCount(): number;
}

/**
 * Repository wrapper that simulates message failures
 */
class FailingRepositoryWrapper {
  private originalRepo: any;
  private failureRate: number = 0;
  private dropNextCount: number = 0;
  private droppedMessages: number = 0;
  private successfulMessages: number = 0;
  private originalSend: any;

  constructor(repository: any) {
    this.originalRepo = repository;
    this.originalSend = repository.send.bind(repository);
    
    // Override the send method
    repository.send = (data: any) => {
      if (this.shouldDropMessage()) {
        this.droppedMessages++;
        console.log(`[FailureSimulator] Dropped message ${this.droppedMessages} (${data.length} bytes)`);
        // Don't call the actual send, simulating message loss
        return;
      }
      
      this.successfulMessages++;
      return this.originalSend(data);
    };
  }

  private shouldDropMessage(): boolean {
    if (this.dropNextCount > 0) {
      this.dropNextCount--;
      return true;
    }
    
    return Math.random() < this.failureRate;
  }

  getController(): IFailureController {
    return {
      setFailureRate: (rate: number) => { this.failureRate = Math.max(0, Math.min(1, rate)); },
      setDropNextMessages: (count: number) => { this.dropNextCount = count; },
      resetFailures: () => { 
        this.failureRate = 0; 
        this.dropNextCount = 0; 
        this.droppedMessages = 0; 
        this.successfulMessages = 0; 
      },
      getDroppedCount: () => this.droppedMessages,
      getSuccessCount: () => this.successfulMessages
    };
  }

  restore() {
    this.originalRepo.send = this.originalSend;
  }
}

export function testErmesMessagingFailure(
  f: () => Promise<{
    service_1: IErmesService, 
    service_2: IErmesService
  }>
) {

  let service_1: IErmesService;
  let service_2: IErmesService;
  let failureController_1: IFailureController;
  let failureController_2: IFailureController;
  let repositoryWrapper_1: FailingRepositoryWrapper;
  let repositoryWrapper_2: FailingRepositoryWrapper;

  describe('Ermes Messaging Failure Tests', function () {

    before(async function () {
      this.timeout(20000); 
      let x = await f();
      service_1 = x.service_1;
      service_2 = x.service_2;
      
      // Setup failure simulation for both services
      repositoryWrapper_1 = new FailingRepositoryWrapper((service_1 as any)._repository);
      repositoryWrapper_2 = new FailingRepositoryWrapper((service_2 as any)._repository);
      failureController_1 = repositoryWrapper_1.getController();
      failureController_2 = repositoryWrapper_2.getController();
    });

    beforeEach(function() {
      failureController_1.resetFailures();
      failureController_2.resetFailures();
    });

    after(function() {
      if (repositoryWrapper_1) repositoryWrapper_1.restore();
      if (repositoryWrapper_2) repositoryWrapper_2.restore();
    });

    it('should handle single message drop - sender thinks it sent successfully', async function() {
      this.timeout(5000);
      
      let messageReceived = false;
      let messageSent = false;
      
      // Setup to drop the next message
      failureController_1.setDropNextMessages(1);
      
      // Setup callbacks
      service_1.onDataSended((data) => {
        messageSent = true;
        console.log(`Sender callback: message sent (${data.length} bytes)`);
      });
      
      service_2.onMessage((data) => {
        messageReceived = true;
        console.log(`Receiver callback: message received (${data.length} bytes)`);
      });
      
      const testData = new Uint8Array([1, 2, 3, 4, 5]);
      service_1.send(testData);
      
      // Wait a bit for potential message delivery
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      expect(messageSent).to.be.true;
      expect(messageReceived).to.be.false;
      expect(failureController_1.getDroppedCount()).to.equal(1);
      expect(failureController_1.getSuccessCount()).to.equal(0);
    });

    it('should handle random message failures with 50% failure rate', async function() {
      this.timeout(10000);
      
      const messageCount = 10;
      const testMessages = Array.from({length: messageCount}, (_, i) => 
        new Uint8Array([i + 1, i + 2, i + 3]));
      
      let messagesReceived: Uint8Array[] = [];
      let messagesSent = 0;
      
      // Set 50% failure rate
      failureController_1.setFailureRate(0.5);
      
      service_1.onDataSended(() => {
        messagesSent++;
      });
      
      const allReceived = new Promise<void>((resolve) => {
        const timeout = setTimeout(() => resolve(), 3000);
        
        service_2.onMessage((data) => {
          messagesReceived.push(data);
          if (messagesReceived.length === messageCount) {
            clearTimeout(timeout);
            resolve();
          }
        });
      });
      
      // Send all messages rapidly
      for (const msg of testMessages) {
        service_1.send(msg);
        // Small delay to avoid overwhelming
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      await allReceived;
      
      expect(messagesSent).to.equal(messageCount);
      expect(messagesReceived.length).to.be.lessThan(messageCount);
      expect(failureController_1.getDroppedCount()).to.be.greaterThan(0);
      
      console.log(`Messages sent: ${messagesSent}, received: ${messagesReceived.length}, dropped: ${failureController_1.getDroppedCount()}`);
    });

    it('should handle large message failure during chunking', async function() {
      this.timeout(15000);
      
      // Create a large message that will be chunked
      const largeSize = 5000;
      const largeData = new Uint8Array(largeSize);
      for (let i = 0; i < largeSize; i++) {
        largeData[i] = i % 256;
      }
      
      let messageSent = false;
      let messageReceived = false;
      let receivedData: Uint8Array | null = null;
      
      // Drop some chunks randomly
      failureController_1.setFailureRate(0.3);
      
      service_1.onDataSended(() => {
        messageSent = true;
        console.log('Large message sent (according to sender)');
      });
      
      const messagePromise = new Promise<void>((resolve) => {
        const timeout = setTimeout(() => {
          console.log('Timeout waiting for large message');
          resolve();
        }, 10000);
        
        service_2.onMessage((data) => {
          messageReceived = true;
          receivedData = data;
          clearTimeout(timeout);
          resolve();
        });
      });
      
      service_1.send(largeData);
      await messagePromise;
      
      expect(messageSent).to.be.true;
      expect(failureController_1.getDroppedCount()).to.be.greaterThan(0);
      
      if (messageReceived && receivedData !== null) {
        // If message was received despite some chunk losses, it means the protocol handled it
        expect((receivedData as Uint8Array).length).to.equal(largeSize);
        console.log('Message successfully reassembled despite chunk losses');
      } else {
        // Message was not received due to missing chunks
        expect(messageReceived).to.be.false;
        console.log('Message not received due to missing chunks');
      }
    });

    it('should handle bidirectional failures', async function() {
      this.timeout(8000);
      
      const message1 = new Uint8Array([10, 20, 30]);
      const message2 = new Uint8Array([40, 50, 60]);
      
      let service1Sent = false;
      let service2Sent = false;
      let service1Received = false;
      let service2Received = false;
      
      // Drop messages in both directions with different rates
      failureController_1.setFailureRate(0.7); // High failure rate for service 1
      failureController_2.setFailureRate(0.3); // Lower failure rate for service 2
      
      service_1.onDataSended(() => { service1Sent = true; });
      service_2.onDataSended(() => { service2Sent = true; });
      
      service_1.onMessage(() => { service1Received = true; });
      service_2.onMessage(() => { service2Received = true; });
      
      const testComplete = new Promise<void>((resolve) => {
        setTimeout(resolve, 3000);
      });
      
      // Send messages in both directions
      service_1.send(message1);
      service_2.send(message2);
      
      await testComplete;
      
      expect(service1Sent).to.be.true;
      expect(service2Sent).to.be.true;
      
      // Due to different failure rates, we expect different delivery success
      console.log(`Service 1 -> 2: sent=${service1Sent}, received=${service2Received}, dropped=${failureController_1.getDroppedCount()}`);
      console.log(`Service 2 -> 1: sent=${service2Sent}, received=${service1Received}, dropped=${failureController_2.getDroppedCount()}`);
      
      // At least one direction should have failures
      expect(failureController_1.getDroppedCount() + failureController_2.getDroppedCount()).to.be.greaterThan(0);
    });

    it('should handle complete communication blackout', async function() {
      this.timeout(5000);
      
      // Set 100% failure rate
      failureController_1.setFailureRate(1.0);
      failureController_2.setFailureRate(1.0);
      
      let messagesSent = 0;
      let messagesReceived = 0;
      
      service_1.onDataSended(() => messagesSent++);
      service_2.onDataSended(() => messagesSent++);
      
      service_1.onMessage(() => messagesReceived++);
      service_2.onMessage(() => messagesReceived++);
      
      // Send multiple messages
      for (let i = 0; i < 5; i++) {
        service_1.send(new Uint8Array([i, i+1]));
        service_2.send(new Uint8Array([i+10, i+11]));
      }
      
      // Wait for potential deliveries
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      expect(messagesSent).to.equal(10); // All sends should report success
      expect(messagesReceived).to.equal(0); // But no messages should be received
      expect(failureController_1.getDroppedCount()).to.be.greaterThan(0);
      expect(failureController_2.getDroppedCount()).to.be.greaterThan(0);
    });

    it('should handle partial message recovery after failures', async function() {
      this.timeout(8000);
      
      const messages = [
        new Uint8Array([1, 1, 1]),
        new Uint8Array([2, 2, 2]),
        new Uint8Array([3, 3, 3]),
        new Uint8Array([4, 4, 4]),
        new Uint8Array([5, 5, 5])
      ];
      
      let messagesReceived: Uint8Array[] = [];
      let messagesSent = 0;
      
      service_1.onDataSended(() => messagesSent++);
      
      service_2.onMessage((data) => {
        messagesReceived.push(data);
      });
      
      // First batch: high failure rate
      failureController_1.setFailureRate(0.8);
      service_1.send(messages[0]);
      service_1.send(messages[1]);
      service_1.send(messages[2]);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Second batch: no failures
      failureController_1.setFailureRate(0.0);
      service_1.send(messages[3]);
      service_1.send(messages[4]);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      expect(messagesSent).to.equal(5);
      expect(messagesReceived.length).to.be.lessThan(5);
      expect(messagesReceived.length).to.be.greaterThan(0);
      
      // The last two messages should likely be received due to no failures
      const lastMessages = messagesReceived.slice(-2);
      expect(lastMessages.length).to.be.greaterThan(0);
      
      console.log(`Sent: ${messagesSent}, Received: ${messagesReceived.length}, Pattern shows recovery from failures`);
    });

  });
}
