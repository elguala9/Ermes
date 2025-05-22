import { ErmesService, IdHandlerRepository, IdHandlerService, PeerHandler } from "ermes/index";
import { CallbackOnMessage } from "iermes/index";
import { testErmesService } from "test-ermes";

let max = 1000;
let start = 0;

async function mainAsync(){
    let idHandlerRepo_1 = new IdHandlerRepository(max, start);
    let idHandlerService_1 = new IdHandlerService(idHandlerRepo_1);

    let idHandlerRepo_2 = new IdHandlerRepository(max, start);
    let idHandlerService_2 = new IdHandlerService(idHandlerRepo_2);

    const dummyCallback: CallbackOnMessage = (obj) =>{

    }
    let repo_1 = new PeerHandler({});

    let offer = await repo_1.createOffer();


    let repo_2 = new PeerHandler({});



    let service_1 = new ErmesService({
        idHandler: idHandlerService_1,
        messageCallback: dummyCallback,
        repository: repo_1
    });

    service_1


    let service_2 = new ErmesService({
        idHandler: idHandlerRepo_2,
        messageCallback: dummyCallback,
        repository: repo_2
    });

    testErmesService(service_1, service_2);
}

