import * as fs from 'fs';
import * as path from 'path';
import { SignalingSdkFactoryNode } from "signaling-sdk/Factories";
import { testSerialization, testSignalingConnectionRepo } from "test-ermes";
import { privateKeys } from "./var";
import { ErmesWebRtcFactory } from 'ermes/ermes-implementation/WebRtc/ErmesWebRtcFactory';
import { ErmesSignalingFactory } from 'ermes/ermes-signaling/ErmesSignalingFactory';

let rpc = "http://127.0.0.1:8545/";


async function main(){
    const filePath = path.join(__dirname, '../../../token_info.txt');

// Leggi il file come stringa
    const address: string = fs.readFileSync(filePath, 'utf-8');

    let SDK_1 = await SignalingSdkFactoryNode(rpc, privateKeys[0], address);
    let factory = new ErmesWebRtcFactory();
    let service_1 = factory.createService({}, {});
    testSerialization(service_1, SDK_1);
}

main();
