import * as fs from 'fs';
import * as path from 'path';
import { SignalingSdkFactoryNode } from "signaling-sdk/Factories";
import { testSignalingSmartContract, testSignalingSmartContractMultiOffer } from "test-ermes";
import { privateKeys } from "./var";
import { SignalingMultiOfferSdkFactoryNode } from 'signaling-sdk/FactoriesMultiOffer';

let rpc = "http://127.0.0.1:8545/";


async function main(){
    const filePath = path.join(__dirname, '../../../token_info.txt');

// Leggi il file come stringa
    const address: string = fs.readFileSync(filePath, 'utf-8');

    let service_1 = await SignalingMultiOfferSdkFactoryNode(rpc, privateKeys[0], address);
    let service_2 = await SignalingMultiOfferSdkFactoryNode(rpc, privateKeys[1], address);
    testSignalingSmartContractMultiOffer(service_1, service_2);
}

main();
