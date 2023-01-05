import fs from 'fs/promises';
import path from 'path';
import { UniversityMatch } from './compareResults';
import { University } from './fragDenStaatScraper';

const UNI_DATA_PATH = path.join(__dirname, '..', 'data', 'scrapedUniversities.json');
const UNI_MATCHES_PATH = path.join(__dirname, '..', 'data', 'uniMatches.json');

export const saveUniversitiesAsJson = async (data: University[]) => {

    await fs.mkdir(path.join(__dirname, '..', 'data'), { recursive: true });
    await fs.writeFile(UNI_DATA_PATH, JSON.stringify(data));
}

export const saveUniversityMatchesAsJson = async (data: UniversityMatch[]) => {

    await fs.mkdir(path.join(__dirname, '..', 'data'), { recursive: true });
    await fs.writeFile(UNI_MATCHES_PATH, JSON.stringify(data));
}

export const loadUniversitiesFromJson = async (): Promise<University[]> => {

    const rawData = await fs.readFile(UNI_DATA_PATH, 'utf-8');
    const parsedData = JSON.parse(rawData) as University[];

    return parsedData;
}