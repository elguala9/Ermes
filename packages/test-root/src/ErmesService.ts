import { testErmesService } from "test-ermes";
import { factoryAsync } from "./utility/ErmesFactory";

let max = 1000;
let start = 0;



testErmesService(factoryAsync);
