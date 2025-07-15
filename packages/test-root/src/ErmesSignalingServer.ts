import * as fs from 'fs';
import * as path from 'path';
import { SignalingSdkFactoryNode } from "signaling-sdk/Factories";
import { testSignalingServer, testSignalingSmartContract } from "test-ermes";
import { privateKeys } from "./var";

let rpc = "http://127.0.0.1:8545/";


async function main(){
    const filePath = path.join(__dirname, '../../../token_info.txt');

// Leggi il file come stringa
    const address: string = fs.readFileSync(filePath, 'utf-8');

    let service_1 = await SignalingSdkFactoryNode(rpc, privateKeys[0], address);
    let service_2 = await SignalingSdkFactoryNode(rpc, privateKeys[1], address);
    let service_3 = await SignalingSdkFactoryNode(rpc, privateKeys[3], address);
    testSignalingServer(service_1, service_2, service_3);
}

main();
