import { Neo4jService } from 'nest-neo4j/dist';
import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    private readonly neo4jService;
    constructor(appService: AppService, neo4jService: Neo4jService);
    getHello(): Promise<any>;
}
