import * as fs from 'fs';
import * as path from 'path';
import { SignalingSdkFactoryNode } from "signaling-sdk/Factories";
import { testSignalingConnectionRepo, testSignalingHandler } from "test-ermes";
import { privateKeys } from "./var";
import { ErmesWebRtcFactory } from 'ermes/ermes-implementation/WebRtc/ErmesWebRtcFactory';
import { ErmesSignalingFactory } from 'ermes/ermes-signaling/ErmesSignalingFactory';
import { SignalingMultiOfferSdkFactoryNode } from 'signaling-sdk/FactoriesMultiOffer';
import { SignalManager } from 'ermes/index';
import { IdAccountType } from 'iermes/index';



async function main(){


    // Create three separate SignalManager instances for testing
    const handler1 = new SignalManager();
    const handler2 = new SignalManager();
    const handler3 = new SignalManager();

    // Create three different account IDs for testing
    const account1: IdAccountType = "test-account-1";
    const account2: IdAccountType = "test-account-2";
    const account3: IdAccountType = "test-account-3";

    // Call testSignalingHandler with all required parameters
    testSignalingHandler(
        handler1,    // service_1: IErmesSignalingHandler<SocketType>
        handler2,    // service_2: IErmesSignalingHandler<SocketType>
        handler3,    // service_3: IErmesSignalingHandler<SocketType>
        account1,    // account_1: IdAccountType
        account2,    // account_2: IdAccountType
        account3     // account_3: IdAccountType
    );
}

main();
