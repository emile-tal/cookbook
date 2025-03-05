import { Lora } from 'next/font/google';
import { Playfair_Display } from 'next/font/google';
import { Poppins } from 'next/font/google';

export const inter = Poppins({ weight: ["400", "700"], subsets: ['latin'] });
export const lusitana = Lora({ weight: ["400", "700"], subsets: ['latin'], style: ['normal', 'italic'] })
export const playfair = Playfair_Display({ weight: ["400", "700"], subsets: ['latin'] })