export const parsePaginationParams = (num, defaultNum) => {
    const isString = typeof num === 'string';

    if (!isString) return defaultNum;

    const parsedNum = Number(num);
    if (Number.isNaN(parsedNum)) return defaultNum;

    return parsedNum;
}