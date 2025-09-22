import { createErmesStorageAndCaching, ErmesStorageAndCaching } from "ermes-storage/index";
import { testStorageAndCaching } from "test-ermes";

let obj: ErmesStorageAndCaching = createErmesStorageAndCaching();

testStorageAndCaching(obj);