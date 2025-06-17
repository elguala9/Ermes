import { testErmesServiceAbsentConnection, testErmesServiceConnection, testSignalingSmartContract } from "test-ermes";
import { factoryAsync } from "./utility/ErmesFactory";
import { ErmesWebRtcFactory } from "ermes/index";
import { SignalingSdkFactoryNode } from "signaling-sdk/Factories";
import { privateKeys } from "./var";
import * as fs from 'fs';
import * as path from 'path';

let rpc = "";


function main(){
    const filePath = path.join(__dirname, '../../../token_info.txt');

// Leggi il file come stringa
    const address: string = fs.readFileSync(filePath, 'utf-8');

    let service_1 = SignalingSdkFactoryNode(rpc, privateKeys[0], );
    testSignalingSmartContract();
}

main();
