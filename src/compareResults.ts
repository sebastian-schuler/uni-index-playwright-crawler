import { getDbInstitutions } from "./database/dbHandler"
import { loadUniversitiesFromJson, saveUniversityMatchesAsJson } from "./fileHandler";
import { University } from "./fragDenStaatScraper";
import { countDuplicates, removeDuplicates } from "./util/util";
import stringSimilarity from 'string-similarity';

export type UniversityMatch = {
    dbName: string;
    bestMatch: Match
    otherMatches: Match[]
}

type Match = {
    scrapedName: string;
    score: number;
}

export const compareScrapedResults = async () => {

    const dbData = await getDbInstitutions();
    let scrapedData = await loadUniversitiesFromJson();
    scrapedData = removeDuplicates(scrapedData);

    const dbNames = dbData.map((db) => db.name);
    const scrapedNames = scrapedData.map((scraped) => scraped.name);

    const matchArr: UniversityMatch[] = [];
    let averageScore = 0;
    let scoresLessThan90 = 0;
    let scoresLessThan75 = 0;
    let scoresLessThan50 = 0;

    for (const dbName of dbNames) {

        let matches = stringSimilarity.findBestMatch(dbName, scrapedNames);
        // If the best match is not 100% similar, check if there are other matches that are 75% similar or more
        const otherMatches = matches.bestMatch.rating !== 1 ? matches.ratings.filter((match) => match.rating > 0.75 && match.target !== matches.bestMatch.target) : [];
        averageScore += matches.bestMatch.rating;

        if (matches.bestMatch.rating < 0.9) scoresLessThan90++;
        if (matches.bestMatch.rating < 0.75) scoresLessThan75++;
        if (matches.bestMatch.rating < 0.5) scoresLessThan50++;

        matchArr.push({
            dbName: dbName,
            bestMatch: {
                scrapedName: matches.bestMatch.target,
                score: matches.bestMatch.rating
            },
            otherMatches: otherMatches.map((match) => {
                return {
                    scrapedName: match.target,
                    score: match.rating
                }
            })
        })
    }

    console.log(`Average score: ${averageScore / dbNames.length}`);
    console.log(`Scores less than 90%: ${scoresLessThan90}`);
    console.log(`Scores less than 75%: ${scoresLessThan75}`);
    console.log(`Scores less than 50%: ${scoresLessThan50}`);

    saveUniversityMatchesAsJson(matchArr);
}

