import { University } from "../fragDenStaatScraper";

export const countDuplicates = (arr: University[]) => {
    const counts = new Map<string, number>();
    arr.forEach(obj => {
        counts.set(obj.name, (counts.get(obj.name) || 0) + 1);
    });
    counts.forEach((value, key) => {
        if (value < 2) counts.delete(key);
    });
    return counts;
}

export const removeDuplicates = (arr: University[]): University[] => {
    const seen = new Set();
    return arr.filter(obj => {
        return seen.has(obj.name) ? false : seen.add(obj.name);
    });
}