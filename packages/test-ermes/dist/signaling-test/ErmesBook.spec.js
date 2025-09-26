import { expect } from "chai";
export function testBook(service) {
    describe('Book Tests', function () {
        beforeEach(async function () {
            // Clean up before each test
            await service.clear();
        });
        after(async function () {
            // Clean up after all tests
            await service.destroy();
        });
        describe('setAccount', function () {
            it('should set a new account with info', async function () {
                const accountId = "test-peer-1";
                const bookInput = { name: "Test Book" };
                await service.setAccount(accountId, bookInput);
                const result = await service.getAccount(accountId);
                expect(result.peerId).to.equal(accountId);
                expect(result.name).to.equal("Test Book");
                expect(result.timestamp).to.be.a('number');
            });
            it('should handle setAccount without info', async function () {
                const accountId = "test-peer-2";
                // Should not throw error
                await service.setAccount(accountId);
                // Account should not exist
                try {
                    await service.getAccount(accountId);
                    expect.fail("Should have thrown error");
                }
                catch (error) {
                    expect(error.message).to.include("Account not found");
                }
            });
            it('should update existing account when calling setAccount again', async function () {
                const accountId = "test-peer-3";
                const firstBook = { name: "First Book" };
                const secondBook = { name: "Second Book" };
                await service.setAccount(accountId, firstBook);
                const firstResult = await service.getAccount(accountId);
                await service.setAccount(accountId, secondBook);
                const secondResult = await service.getAccount(accountId);
                expect(secondResult.name).to.equal("Second Book");
                expect(secondResult.timestamp).to.be.greaterThan(firstResult.timestamp);
                expect(await service.numberOfElements()).to.equal(1);
            });
        });
        describe('updateAccount', function () {
            it('should update existing account', async function () {
                const accountId = "test-peer-4";
                const originalBook = { name: "Original Book" };
                const updateInfo = { name: "Updated Book" };
                await service.setAccount(accountId, originalBook);
                const originalTimestamp = (await service.getAccount(accountId)).timestamp;
                await service.updateAccount(accountId, updateInfo);
                const result = await service.getAccount(accountId);
                expect(result.name).to.equal("Updated Book");
                expect(result.timestamp).to.be.greaterThan(originalTimestamp);
            });
            it('should handle partial updates', async function () {
                const accountId = "test-peer-5";
                const originalBook = { name: "Original Book" };
                const partialUpdate = {}; // Empty update
                await service.setAccount(accountId, originalBook);
                await service.updateAccount(accountId, partialUpdate);
                const result = await service.getAccount(accountId);
                expect(result.name).to.equal("Original Book"); // Should remain unchanged
            });
            it('should throw error when updating non-existent account', async function () {
                const accountId = "non-existent-peer";
                const updateInfo = { name: "New Name" };
                try {
                    await service.updateAccount(accountId, updateInfo);
                    expect.fail("Should have thrown error");
                }
                catch (error) {
                    expect(error.message).to.include("Account not found");
                }
            });
        });
        describe('getAccount', function () {
            it('should get existing account', async function () {
                const accountId = "test-peer-6";
                const bookInput = { name: "Get Test Book" };
                await service.setAccount(accountId, bookInput);
                const result = await service.getAccount(accountId);
                expect(result.peerId).to.equal(accountId);
                expect(result.name).to.equal("Get Test Book");
                expect(result.timestamp).to.be.a('number');
            });
            it('should throw error for non-existent account', async function () {
                const accountId = "non-existent-peer";
                try {
                    await service.getAccount(accountId);
                    expect.fail("Should have thrown error");
                }
                catch (error) {
                    expect(error.message).to.include("Account not found");
                }
            });
        });
        describe('getAccountList', function () {
            beforeEach(async function () {
                // Set up test data
                await service.setAccount("peer-a", { name: "Book A" });
                await service.setAccount("peer-b", { name: "Book B" });
                await service.setAccount("peer-c", { name: "Book C" });
                await service.setAccount("peer-d", { name: "Book D" });
            });
            it('should get first page of accounts', async function () {
                const result = await service.getAccountList("", 2);
                expect(result.items).to.have.length(2);
                expect(result.pageSize).to.equal(2);
                expect(result.totalItems).to.equal(4);
                expect(result.eof).to.be.false;
                expect(result.cursor).to.equal("");
                expect(result.nextCursor).to.be.a('string');
                // Check if items are sorted
                expect(result.items[0].account).to.equal("peer-a");
                expect(result.items[0].info?.name).to.equal("Book A");
            });
            it('should handle cursor-based pagination', async function () {
                const firstPage = await service.getAccountList("", 2);
                const secondPage = await service.getAccountList("peer-c", 2);
                expect(secondPage.items).to.have.length(2);
                expect(secondPage.items[0].account).to.equal("peer-c");
                expect(secondPage.items[1].account).to.equal("peer-d");
                expect(secondPage.eof).to.be.true;
            });
            it('should handle empty result set', async function () {
                await service.clear();
                const result = await service.getAccountList("", 10);
                expect(result.items).to.have.length(0);
                expect(result.totalItems).to.equal(0);
                expect(result.eof).to.be.true;
            });
            it('should handle limit larger than total items', async function () {
                const result = await service.getAccountList("", 10);
                expect(result.items).to.have.length(4);
                expect(result.eof).to.be.true;
                expect(result.totalItems).to.equal(4);
            });
            it('should handle invalid cursor gracefully', async function () {
                const result = await service.getAccountList("non-existent", 2);
                expect(result.items).to.have.length(0);
                expect(result.totalItems).to.equal(4);
            });
        });
        describe('deleteAccount', function () {
            it('should delete existing account', async function () {
                const accountId = "test-peer-7";
                const bookInput = { name: "To Delete Book" };
                await service.setAccount(accountId, bookInput);
                expect(await service.numberOfElements()).to.equal(1);
                const deleteResult = await service.deleteAccount(accountId);
                expect(deleteResult).to.be.true;
                expect(await service.numberOfElements()).to.equal(0);
                try {
                    await service.getAccount(accountId);
                    expect.fail("Should have thrown error");
                }
                catch (error) {
                    expect(error.message).to.include("Account not found");
                }
            });
            it('should return false when deleting non-existent account', async function () {
                const accountId = "non-existent-peer";
                const result = await service.deleteAccount(accountId);
                expect(result).to.be.false;
            });
            it('should update numberOfElements correctly after deletion', async function () {
                await service.setAccount("peer-1", { name: "Book 1" });
                await service.setAccount("peer-2", { name: "Book 2" });
                await service.setAccount("peer-3", { name: "Book 3" });
                expect(await service.numberOfElements()).to.equal(3);
                await service.deleteAccount("peer-2");
                expect(await service.numberOfElements()).to.equal(2);
                await service.deleteAccount("peer-1");
                await service.deleteAccount("peer-3");
                expect(await service.numberOfElements()).to.equal(0);
            });
        });
        describe('clear', function () {
            it('should clear all accounts', async function () {
                await service.setAccount("peer-1", { name: "Book 1" });
                await service.setAccount("peer-2", { name: "Book 2" });
                await service.setAccount("peer-3", { name: "Book 3" });
                expect(await service.numberOfElements()).to.equal(3);
                await service.clear();
                expect(await service.numberOfElements()).to.equal(0);
                expect(await service.listOfIds()).to.have.length(0);
            });
            it('should work on empty collection', async function () {
                await service.clear();
                expect(await service.numberOfElements()).to.equal(0);
                expect(await service.listOfIds()).to.have.length(0);
            });
        });
        describe('numberOfElements', function () {
            it('should return correct count', async function () {
                expect(await service.numberOfElements()).to.equal(0);
                await service.setAccount("peer-1", { name: "Book 1" });
                expect(await service.numberOfElements()).to.equal(1);
                await service.setAccount("peer-2", { name: "Book 2" });
                expect(await service.numberOfElements()).to.equal(2);
                await service.deleteAccount("peer-1");
                expect(await service.numberOfElements()).to.equal(1);
            });
            it('should handle duplicate setAccount calls', async function () {
                await service.setAccount("peer-1", { name: "Book 1" });
                expect(await service.numberOfElements()).to.equal(1);
                await service.setAccount("peer-1", { name: "Book 1 Updated" });
                expect(await service.numberOfElements()).to.equal(1);
            });
        });
        describe('listOfIds', function () {
            it('should return all account IDs', async function () {
                await service.setAccount("peer-c", { name: "Book C" });
                await service.setAccount("peer-a", { name: "Book A" });
                await service.setAccount("peer-b", { name: "Book B" });
                const ids = await service.listOfIds();
                expect(ids).to.have.length(3);
                expect(ids).to.include.members(["peer-a", "peer-b", "peer-c"]);
            });
            it('should return empty array when no accounts exist', async function () {
                const ids = await service.listOfIds();
                expect(ids).to.have.length(0);
                expect(ids).to.be.an('array');
            });
            it('should be consistent with numberOfElements', async function () {
                await service.setAccount("peer-1", { name: "Book 1" });
                await service.setAccount("peer-2", { name: "Book 2" });
                const ids = await service.listOfIds();
                const count = await service.numberOfElements();
                expect(ids.length).to.equal(count);
            });
        });
        describe('Edge Cases and Error Handling', function () {
            it('should handle special characters in account IDs', async function () {
                const specialId = "peer@#$%^&*()_+-=[]{}|;':\",./<>?";
                const bookInput = { name: "Special Chars Book" };
                await service.setAccount(specialId, bookInput);
                const result = await service.getAccount(specialId);
                expect(result.peerId).to.equal(specialId);
                expect(result.name).to.equal("Special Chars Book");
            });
            it('should handle empty account ID', async function () {
                const emptyId = "";
                const bookInput = { name: "Empty ID Book" };
                await service.setAccount(emptyId, bookInput);
                const result = await service.getAccount(emptyId);
                expect(result.peerId).to.equal(emptyId);
            });
            it('should handle very long account IDs', async function () {
                const longId = "a".repeat(1000);
                const bookInput = { name: "Long ID Book" };
                await service.setAccount(longId, bookInput);
                const result = await service.getAccount(longId);
                expect(result.peerId).to.equal(longId);
            });
            it('should handle unicode characters in book names', async function () {
                const accountId = "unicode-peer";
                const unicodeBook = { name: "📚 Unicode Book 中文 🎉" };
                await service.setAccount(accountId, unicodeBook);
                const result = await service.getAccount(accountId);
                expect(result.name).to.equal("📚 Unicode Book 中文 🎉");
            });
        });
        describe('Performance and Stress Tests', function () {
            it('should handle large number of accounts efficiently', async function () {
                this.timeout(10000); // 10 second timeout
                const numberOfAccounts = 100;
                // Add many accounts
                for (let i = 0; i < numberOfAccounts; i++) {
                    await service.setAccount(`peer-${i.toString().padStart(3, '0')}`, {
                        name: `Book ${i}`
                    });
                }
                expect(await service.numberOfElements()).to.equal(numberOfAccounts);
                // Test pagination with large dataset
                const pageResult = await service.getAccountList("", 10);
                expect(pageResult.items).to.have.length(10);
                expect(pageResult.totalItems).to.equal(numberOfAccounts);
                // Test retrieval
                const result = await service.getAccount("peer-050");
                expect(result.name).to.equal("Book 50");
            });
            it('should maintain consistent performance with repeated operations', async function () {
                this.timeout(5000);
                const accountId = "performance-peer";
                // Repeated set/update operations
                for (let i = 0; i < 50; i++) {
                    await service.setAccount(accountId, { name: `Iteration ${i}` });
                    await service.updateAccount(accountId, { name: `Updated ${i}` });
                }
                const result = await service.getAccount(accountId);
                expect(result.name).to.equal("Updated 49");
                expect(await service.numberOfElements()).to.equal(1);
            });
        });
        describe('Integration Tests', function () {
            it('should maintain data consistency across all operations', async function () {
                // Complex workflow test
                const accounts = [
                    { id: "user-1", name: "Alice's Book" },
                    { id: "user-2", name: "Bob's Book" },
                    { id: "user-3", name: "Charlie's Book" }
                ];
                // Step 1: Add accounts
                for (const account of accounts) {
                    await service.setAccount(account.id, { name: account.name });
                }
                expect(await service.numberOfElements()).to.equal(3);
                // Step 2: Update one account
                await service.updateAccount("user-2", { name: "Bob's Updated Book" });
                // Step 3: Get account list
                const listResult = await service.getAccountList("", 10);
                expect(listResult.items).to.have.length(3);
                // Step 4: Verify specific account was updated
                const bobsBook = await service.getAccount("user-2");
                expect(bobsBook.name).to.equal("Bob's Updated Book");
                // Step 5: Delete one account
                await service.deleteAccount("user-3");
                expect(await service.numberOfElements()).to.equal(2);
                // Step 6: Verify list is updated
                const finalIds = await service.listOfIds();
                expect(finalIds).to.include.members(["user-1", "user-2"]);
                expect(finalIds).to.not.include("user-3");
            });
        });
    });
}
//# sourceMappingURL=ErmesBook.spec.js.map