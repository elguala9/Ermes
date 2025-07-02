import { ErmesWebRtcFactory } from "ermes/index";
import { testErmesServiceAbsentConnection, testErmesServiceConnection } from "test-ermes";
import { factoryAsync } from "./utility/ErmesFactory";

let max = 1000;
let start = 0;

let factory = new ErmesWebRtcFactory();
let service_3 = factory.createService({});

testErmesServiceConnection(factoryAsync);
testErmesServiceAbsentConnection(service_3);