import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function scaleIngredient(input: string, originalYield: number, newYield: number): string {
    if (originalYield === 0 || newYield === 0) {
        return input;
    }
    if (originalYield === newYield) {
        return input;
    }

    // Helper: Greatest Common Divisor
    function gcd(a: number, b: number): number {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b !== 0) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    // Helper: Convert decimal to fraction string (rounded to nearest 1/4)
    function decimalToFraction(decimal: number): string {
        const precision = 4; // Nearest 1/4
        const roundedDecimal = Math.round(decimal * precision) / precision;

        const numerator = Math.round(roundedDecimal * precision);
        const denominator = precision;

        if (numerator === 0) return "0";

        const divisor = gcd(numerator, denominator);
        return `${numerator / divisor}/${denominator / divisor}`;
    }

    // Helper: Format quantity nicely (fraction or whole number)
    function formatQuantity(quantity: number): string {
        if (quantity === 0) return "0";

        const whole = Math.floor(quantity);
        const fraction = quantity - whole;

        if (fraction === 0) {
            return `${whole}`;
        } else if (whole === 0) {
            return decimalToFraction(fraction);
        } else {
            return `${whole} ${decimalToFraction(fraction)}`;
        }
    }

    // Step 1: Clean up input
    const cleanedInput = input.trim().replace(/-/g, ' ').replace(/\s+/g, ' ');

    // Step 2: Match number at the start
    const match = cleanedInput.match(/^(\d+\s\d+\/\d+|\d+\/\d+|\d*\.\d+|\d+)/);

    if (!match) {
        return input; // No number found, return input unchanged
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

    // Step 3: Scale quantity
    const scaledQuantity = (quantity / originalYield) * newYield;

    // Step 4: Format quantity
    const formattedQuantity = formatQuantity(scaledQuantity);

    // Step 5: Prepare rest of the string (unit etc.)
    const restOfString = cleanedInput.slice(numberStr.length).trim();

    return restOfString ? `${formattedQuantity} ${restOfString}` : formattedQuantity;
}

