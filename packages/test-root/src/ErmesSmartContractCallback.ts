import { testSignalingSmartContractCallback} from "test-ermes";
import { factoryAsync } from "./utility/ErmesFactory";
import { ErmesWebRtcFactory } from "ermes/index";
import { SignalingSdkFactoryNode } from "signaling-sdk/Factories";
import { privateKeys } from "./var";
import * as fs from 'fs';
import * as path from 'path';

let rpc = "http://127.0.0.1:8545/";


async function main(){
    const filePath = path.join(__dirname, '../../../token_info.txt');

// Leggi il file come stringa
    const address: string = fs.readFileSync(filePath, 'utf-8');

    let service_1 = await SignalingSdkFactoryNode(rpc, privateKeys[2], address);
    let service_2 = await SignalingSdkFactoryNode(rpc, privateKeys[3], address);
    testSignalingSmartContractCallback(service_1, service_2);
}

main();
