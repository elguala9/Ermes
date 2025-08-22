import { ErmesService, IdHandlerFactory } from "ermes/index";
import { factoryRepo } from "./ErmesRepositoryFatory";

export async function factoryService() {

    let repos = await factoryRepo();
    let idHandlerFactory = new IdHandlerFactory()
    let idHandler1 = idHandlerFactory.createService({});
    let idHandler2 = idHandlerFactory.createService({});

    let service_1 = new ErmesService({repository: repos.repository1, idHandler: idHandler1});
    let service_2 = new ErmesService({repository: repos.repository2, idHandler: idHandler2});

    return {
        service_1,
        service_2
    };
};