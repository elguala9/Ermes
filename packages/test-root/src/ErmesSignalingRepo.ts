import * as fs from 'fs';
import * as path from 'path';
import { SignalingSdkFactoryNode } from "signaling-sdk/Factories";
import { testSignalingConnectionRepo } from "test-ermes";
import { privateKeys } from "./var";
import { ErmesWebRtcFactory } from 'ermes/ermes-implementation/WebRtc/ErmesWebRtcFactory';
import { ErmesSignalingFactory } from 'ermes/ermes-signaling/ErmesSignalingFactory';
import { SignalingMultiOfferSdkFactoryNode } from 'signaling-sdk/FactoriesMultiOffer';

let rpc = "http://127.0.0.1:8545/";


async function main(){
    const filePath = path.join(__dirname, '../../../token_info.txt');

// Leggi il file come stringa
    const address: string = fs.readFileSync(filePath, 'utf-8');

    let SDK_1 = await SignalingMultiOfferSdkFactoryNode(rpc, privateKeys[4], address);
    let SDK_2 = await SignalingMultiOfferSdkFactoryNode(rpc, privateKeys[5], address);
    let factory = new ErmesWebRtcFactory();
    let WebRTC_1 = factory.createService({}, {});
    let WebRTC_2 = factory.createService({}, {});
    let factorySignaling = new ErmesSignalingFactory();
    let service_1 = factorySignaling.create(SDK_1, WebRTC_1);
    let service_2 = factorySignaling.create(SDK_2, WebRTC_2);
    testSignalingConnectionRepo(service_1, service_2);
}

main();
