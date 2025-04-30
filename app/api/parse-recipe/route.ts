import { NextRequest, NextResponse } from 'next/server';

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { rawText } = await req.json();

    if (!rawText || typeof rawText !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid raw text' }, { status: 400 });
    }

    const prompt = `
You are a recipe parser.

Given the following raw recipe text, extract the structured recipe in the JSON format below.
If any value is missing, return "" for strings and null for numbers.

The JSON format:
{
  title: string,
  description: string,
  categories: string[],
  duration: number | null,
  recipe_yield: number | null,
  ingredients: {
    position: number,
    amount: string | null,
    ingredient: string
  }[],
  instructions: {
    position: number,
    instruction: string
  }[]
}

Return ONLY valid JSON. No explanations or markdown. No extra characters.

Raw text:
"""${rawText}"""
    `.trim();

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You convert messy recipes into clean JSON.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
    });

    const content = completion.choices[0].message.content;

    if (!content) {
      return NextResponse.json({ error: 'Empty response from OpenAI' }, { status: 500 });
    }

    const json = JSON.parse(content); // will throw if OpenAI returned invalid JSON

    return NextResponse.json(json);
  } catch (err: any) {
    console.error('OpenAI error:', err.message);
    return NextResponse.json({ error: 'Failed to parse recipe' }, { status: 500 });
  }
}
