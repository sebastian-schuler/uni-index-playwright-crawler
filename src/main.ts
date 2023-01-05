import { compareScrapedResults } from "./compareResults";
import { runScraper } from "./fragDenStaatScraper";
import { getPersistentBrowser } from "./util/playwrightUtil";


const run = async () => {

    // runScraper();
    compareScrapedResults();
 
}

run();