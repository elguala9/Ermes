import * as chai from "chai";
import { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { ISignalingMultiOfferSdk } from "signaling-sdk/ISignalingMultiOfferSdk";


export function testSignalingSmartContractMultiOffer(
  service_1: ISignalingMultiOfferSdk,
  service_2: ISignalingMultiOfferSdk
) {




  describe('Smart Contract Test', function () {

    let offer: string = "Ciao Offer";
    let answer: string = "Ciao Answer";
    let offer2: string =   "{\"type\":\"offer\",\"sdp\":\"v=0\\r\\no=- 5213238195998285416 2 IN IP4 127.0.0.1\\r\\ns=-\\r\\nt=0 0\\r\\na=group:BUNDLE 0\\r\\na=msid-semantic: WMS\\r\\nm=application 39275 UDP/DTLS/SCTP webrtc-datachannel\\r\\nc=IN IP4 93.57.250.42\\r\\na=candidate:124514630 1 udp 2122260223 172.17.144.1 55196 typ host generation 0 network-id 6\\r\\na=candidate:505252800 1 udp 2122194687 172.25.112.1 55197 typ host generation 0 network-id 7\\r\\na=candidate:472317589 1 udp 2122131711 2001:b07:a3f:3f82:13fc:782:f81b:95c0 55198 typ host generation 0 network-id 2 network-cost 10\\r\\na=candidate:1127843187 1 udp 2122066175 2001:b07:a3f:3f82:bd5f:a754:3472:9b22 55199 typ host generation 0 network-id 3 network-cost 10\\r\\na=candidate:186199869 1 udp 2121998079 192.168.1.101 55200 typ host generation 0 network-id 1 network-cost 10\\r\\na=candidate:559267639 1 udp 2121940223 ::1 55201 typ host generation 0 network-id 5\\r\\na=candidate:1510613869 1 udp 2121867007 127.0.0.1 55202 typ host generation 0 network-id 4\\r\\na=candidate:2320574857 1 udp 1685790463 93.57.250.42 39275 typ srflx raddr 192.168.1.101 rport 55200 generation 0 network-id 1 network-cost 10\\r\\na=candidate:1239944630 1 tcp 1518280447 172.17.144.1 56419 typ host tcptype passive generation 0 network-id 6\\r\\na=candidate:1352562480 1 tcp 1518214911 172.25.112.1 56420 typ host tcptype passive generation 0 network-id 7\\r\\na=candidate:1386545765 1 tcp 1518151935 2001:b07:a3f:3f82:13fc:782:f81b:95c0 56421 typ host tcptype passive generation 0 network-id 2 network-cost 10\\r\\na=candidate:230324611 1 tcp 1518086399 2001:b07:a3f:3f82:bd5f:a754:3472:9b22 56422 typ host tcptype passive generation 0 network-id 3 network-cost 10\\r\\na=candidate:1167774669 1 tcp 1518018303 192.168.1.101 56423 typ host tcptype passive generation 0 network-id 1 network-cost 10\\r\\na=candidate:1876313031 1 tcp 1517960447 ::1 56424 typ host tcptype passive generation 0 network-id 5\\r\\na=candidate:344579997 1 tcp 1517887231 127.0.0.1 56425 typ host tcptype passive generation 0 network-id 4\\r\\na=candidate:1239944630 1 tcp 1518280447 172.17.144.1 56426 typ host tcptype passive generation 0 network-id 6\\r\\na=candidate:1352562480 1 tcp 1518214911 172.25.112.1 56427 typ host tcptype passive generation 0 network-id 7\\r\\na=candidate:1386545765 1 tcp 1518151935 2001:b07:a3f:3f82:13fc:782:f81b:95c0 56428 typ host tcptype passive generation 0 network-id 2 network-cost 10\\r\\na=candidate:230324611 1 tcp 1518086399 2001:b07:a3f:3f82:bd5f:a754:3472:9b22 56429 typ host tcptype passive generation 0 network-id 3 network-cost 10\\r\\na=candidate:1167774669 1 tcp 1518018303 192.168.1.101 56430 typ host tcptype passive generation 0 network-id 1 network-cost 10\\r\\na=candidate:1876313031 1 tcp 1517960447 ::1 56431 typ host tcptype passive generation 0 network-id 5\\r\\na=candidate:344579997 1 tcp 1517887231 127.0.0.1 56432 typ host tcptype passive generation 0 network-id 4\\r\\na=ice-ufrag:vBnv\\r\\na=ice-pwd:jCAC/JyRjE/hBLKbo08m12OH\\r\\na=fingerprint:sha-256 60:81:4F:C8:E0:0D:10:94:D8:CE:6D:6E:1B:5A:80:7F:12:2B:DF:74:F9:D6:2E:C7:F2:48:AE:3B:BE:8B:D6:71\\r\\na=setup:actpass\\r\\na=mid:0\\r\\na=sctp-port:5000\\r\\na=max-message-size:262144\\r\\n\"}";
    let answer2: string = "Ciao Answer 2";
    let service_1_address: string;
    let service_2_address: string;

    before(async function () {
        chai.use(chaiAsPromised);
        service_1_address = await service_1.getAddressUser();
        service_2_address = await service_2.getAddressUser();
    })

    it('Set Answer Without Offer', async () => {
        const address = await service_1.getAddressUser();   
        await expect(service_1.setAnswer(answer, address)).to.be.rejectedWith(Error);
        /*        const address = await service_1.getAddressUser();   
        try {
            await service_1.setAnswer(answer, address);
        }
        catch(e: any){
            return;
        }
        throw new Error("setAnswer should throw an exception");*/
    });


    it('Set Offer', async () => {
        await service_1.setOffer(offer, service_2_address);
    });

    it('Get Offer', async () => {
        let _offer = await service_1.getOffer(service_1_address, service_2_address);
        expect(_offer.signal).to.deep.equal(offer);
    });

    it('Set Answer', async () => {
        await service_2.setAnswer(answer, service_1_address);
    });

    it('Get Answer', async () => {
        let _answer = await service_2.getAnswer(service_2_address, service_1_address);
        expect(_answer.signal).to.deep.equal(answer);
    });

    it('Set Offer 2', async () => {
        await service_1.setOffer(offer2, service_2_address);
    });

    it('Get Offer 2', async () => {
        let _offer = await service_1.getOffer(service_1_address, service_2_address);
        expect(_offer.signal).to.deep.equal(offer2);
    });

    it('Set Answer 2', async () => {
        await service_2.setAnswer(answer2, service_1_address);
    });

    it('Get Answer 2', async () => {
        let _answer = await service_2.getAnswer(service_2_address, service_1_address);
        expect(_answer.signal).to.deep.equal(answer2);
    });


  }
)};



