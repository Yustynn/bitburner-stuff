export function mFormat(money: number): string {
    return (money / 10 ** 9).toPrecision(3) + "B"
}

export function rFormat(ram: number): string {
    return (ram / 10 ** 9).toPrecision(3) + "GB"
}

export function pFormat(frac: number): string {
    return (frac * 100).toPrecision(3) + "%"
}

export function processStrNum(strnum: string): number {
    const lastChar = strnum.slice(-1);
    const baseNum = parseFloat(strnum.slice(0, -1));

    switch (lastChar) {
        case 'k':
            return baseNum * 10 ** 3;
        case 'm':
            return baseNum * 10 ** 6;
        case 't':
            return baseNum * 10 ** 12; // Assuming 't' stands for trillion
        default:
            return parseFloat(strnum);
    }
}