import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function scaleIngredient(input: string, originalYield: number, newYield: number): string {
    if (originalYield === 0 || newYield === 0 || originalYield === newYield) {
        return input;
    }

    try {
        // Unicode fraction replacements
        const unicodeFractionMap: Record<string, string> = {
            '½': '1/2',
            '⅓': '1/3',
            '⅔': '2/3',
            '¼': '1/4',
            '¾': '3/4',
            '⅕': '1/5',
            '⅖': '2/5',
            '⅗': '3/5',
            '⅘': '4/5',
            '⅙': '1/6',
            '⅚': '5/6',
            '⅐': '1/7',
            '⅛': '1/8',
            '⅜': '3/8',
            '⅝': '5/8',
            '⅞': '7/8',
            '⅑': '1/9',
            '⅒': '1/10'
        };

        // Step 1: Normalize unicode fractions
        let normalizedInput = input;
        for (const [unicode, ascii] of Object.entries(unicodeFractionMap)) {
            // Insert space if preceded by digit (e.g., 2½ → 2 1/2)
            normalizedInput = normalizedInput.replace(
                new RegExp(`(\\d)${unicode}`, 'g'),
                `$1 ${ascii}`
            );
            // Replace any remaining instances
            normalizedInput = normalizedInput.replace(
                new RegExp(unicode, 'g'),
                ascii
            );
        }

        // Step 2: Clean up input
        const cleanedInput = normalizedInput.trim().replace(/-/g, ' ').replace(/\s+/g, ' ');

        // Step 3: Match number at the start
        const match = cleanedInput.match(/^(\d+\s\d+\/\d+|\d+\/\d+|\d*\.\d+|\d+)/);

        if (!match) {
            return input; // No number found, return original
        }

        const numberStr = match[0];
        let quantity: number;

        if (numberStr.includes(' ')) {
            // Mixed number
            const [whole, fraction] = numberStr.split(' ');
            const [numerator, denominator] = fraction.split('/').map(Number);
            quantity = Number(whole) + numerator / denominator;
        } else if (numberStr.includes('/')) {
            // Simple fraction
            const [numerator, denominator] = numberStr.split('/').map(Number);
            quantity = numerator / denominator;
        } else {
            // Whole number or decimal
            quantity = Number(numberStr);
        }

        if (!Number.isFinite(quantity) || isNaN(quantity)) return input;

        // Step 4: Scale
        const scaledQuantity = (quantity / originalYield) * newYield;
        if (!Number.isFinite(scaledQuantity) || isNaN(scaledQuantity)) return input;

        // Step 5: Format output
        function gcd(a: number, b: number): number {
            a = Math.abs(a);
            b = Math.abs(b);
            while (b !== 0) {
                const temp = b;
                b = a % b;
                a = temp;
            }
            return a || 1;
        }

        function decimalToFraction(decimal: number): string {
            const precision = 4; // nearest 1/4
            const roundedDecimal = Math.round(decimal * precision) / precision;
            const numerator = Math.round(roundedDecimal * precision);
            const denominator = precision;
            if (numerator === 0) return '0';
            const divisor = gcd(numerator, denominator);
            return `${numerator / divisor}/${denominator / divisor}`;
        }

        function formatQuantity(quantity: number): string {
            if (quantity === 0) return '0';
            const whole = Math.floor(quantity);
            const fraction = quantity - whole;
            if (fraction === 0) return `${whole}`;
            if (whole === 0) return decimalToFraction(fraction);
            return `${whole} ${decimalToFraction(fraction)}`;
        }

        const formattedQuantity = formatQuantity(scaledQuantity);
        const restOfString = cleanedInput.slice(numberStr.length).trim();

        return restOfString ? `${formattedQuantity} ${restOfString}` : formattedQuantity;
    } catch (error) {
        console.error('Error scaling ingredient:', error);
        return input;
    }
}


