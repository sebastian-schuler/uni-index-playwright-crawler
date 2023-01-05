import { Page } from "playwright";
import { saveUniversitiesAsJson } from "./fileHandler";
import { getPersistentBrowser } from "./util/playwrightUtil";

const BASE_URL = "https://fragdenstaat.de";

export type University = {
    name: string;
    website: string;
    address: string;
    email: string;
}

export const runScraper = async () => {

    const browser = await getPersistentBrowser();
    const page = await browser.newPage();

    // Collect all universities
    const universityUrls: string[] = [];
    const uniUrls1 = await collectUniversities("https://fragdenstaat.de/projekt/zahlungen-an-zoom-video-communications-inc/", page);
    const uniUrls2 = await collectUniversities("https://fragdenstaat.de/projekt/zahlungen-an-zoom-video-communications-inc-1/", page);
    universityUrls.push(...uniUrls1);
    universityUrls.push(...uniUrls2);

    const universities: University[] = [];

    // Collect data for each university
    for (const url of universityUrls) {

        await page.goto(BASE_URL + url);
        await page.waitForLoadState('networkidle');

        const heading = await page.getByRole('heading', { level: 2 }).allInnerTexts();
        const detailList = await page.locator('dl').first().all();

        let university: University = {
            name: heading[0],
            website: '',
            address: '',
            email: ''
        };

        for (const detail of detailList) {

            const nodes = await detail.locator("dd, dt").all();

            let nodeIndex = 0;
            for (const node of nodes) {

                const inner = await node.innerHTML();
                const text = inner.trim();

                if (text.startsWith('Webseite:')) {
                    const website = await nodes[nodeIndex + 1].allInnerTexts();
                    university.website = website[0];

                } else if (text.startsWith('Postadresse:')) {
                    const address = await nodes[nodeIndex + 1].allInnerTexts();
                    university.address = address[0];

                } else if (text.startsWith('E-Mail:')) {
                    const email = await nodes[nodeIndex + 1].allInnerTexts();
                    university.email = email[0];

                }

                nodeIndex++;
            }
        }

        universities.push(university);
    }

    saveUniversitiesAsJson(universities);
}

const collectUniversities = async (url: string, page: Page) => {

    await page.goto(url);
    await page.waitForLoadState('networkidle');

    const rows = await page.locator('tbody > tr ').all();

    const result: string[] = [];
    for (const row of rows) {
        const cells = await row.locator('td').all();
        const res = await cells[3].locator('a').first().getAttribute('href');
        if (res) {
            result.push(res);
        }
    }

    return result;
}