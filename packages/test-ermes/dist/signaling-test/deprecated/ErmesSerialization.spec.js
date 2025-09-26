import { expect } from "chai";
export function testSerialization(service_webrtc, service_sc) {
    describe('Serialization Tests', function () {
        it('Serialize Signal', async () => {
            //let signalData = await service_webrtc.createSignal();
            let signal = await service_webrtc.createSignalString();
            let serialized = service_sc.serialize(signal);
            let deserialized = service_sc.deSerialize(serialized);
            //let deserializedSignalData = service_webrtc.parseSignalString(deserialized);
            expect(deserialized).to.equal(signal);
            //expect(signalData).to.equal(deserializedSignalData);
        });
    });
}
;
//# sourceMappingURL=ErmesSerialization.spec.js.map