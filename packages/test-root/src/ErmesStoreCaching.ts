import { createErmesStorageAndCaching, createWorkDB, ErmesStorageAndCachingMessages } from "ermes-storage/index";
import { MessageType } from "ermes-types";
import { testStorageAndCaching } from "test-ermes";

let workDb = createWorkDB({
    dataPath: "./test-db",
    platform: "node"
});

let obj: ErmesStorageAndCachingMessages = createErmesStorageAndCaching<MessageType>(workDb) as ErmesStorageAndCachingMessages;

testStorageAndCaching(obj, obj.caching, obj.storage, 100);