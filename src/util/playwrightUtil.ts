import path from 'path';
import { chromium } from 'playwright';

export const DATA_FOLDER = path.join(__dirname, '..', 'data');

export const getPersistentBrowser = async () => {

    const pathToExtension = path.join(__dirname, '..', 'extension', 'fihnjjcciajhdojfnbdddfaoknhalnja', "3.4.3_0");
    const userDataDir = path.join(__dirname, '..', 'tmp', 'test-user-data-dir');

    const browserContext = await chromium.launchPersistentContext(userDataDir, {
        headless: false,
        args: [
            `--disable-extensions-except=${pathToExtension}`,
            `--load-extension=${pathToExtension}`
        ]
    });
    return browserContext;
}

export const delay = (time: number) => {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}