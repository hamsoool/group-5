import { NextResponse } from 'next/server';
import { generateRecipe } from '../../utils/deepai';

interface Ingredient {
  quantity: number;
  unit: string;
  name: string;
  type: string;
}

interface Recipe {
  title: string;
  servings: number;
  prepTime: string;
  cookingTime: string;
  ingredients: string[];
  instructions: string[];
}

export async function POST(req: Request) {
  try {
    const { ingredients } = await req.json() as { ingredients: Ingredient[] };

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or empty ingredients list' },
        { status: 400 }
      );
    }

    const recipeText = await generateRecipe(ingredients);

    if (!recipeText) {
      throw new Error('Failed to generate recipe text');
    }

    // Parse the response into structured data
    const lines = recipeText.split('\n').map(line => line.trim()).filter(Boolean);
    
    const recipe: Recipe = {
      title: extractValue(lines, 'Title:') || 'Untitled Recipe',
      servings: parseInt(extractValue(lines, 'Servings:') || '4'),
      prepTime: extractValue(lines, 'Prep Time:') || 'N/A',
      cookingTime: extractValue(lines, 'Cooking Time:') || 'N/A',
      ingredients: extractList(lines, 'Ingredients:', '-'),
      instructions: extractList(lines, 'Instructions:', /^\d+\./)
    };

    return NextResponse.json(recipe);
  } catch (error) {
    console.error('Recipe generation error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate recipe',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

function extractValue(lines: string[], prefix: string): string {
  return lines.find(l => l.startsWith(prefix))?.replace(prefix, '').trim() || '';
}

function extractList(lines: string[], section: string, marker: string | RegExp): string[] {
  const sectionIndex = lines.findIndex(l => l.includes(section));
  if (sectionIndex === -1) return [];

  const nextSectionIndex = lines.findIndex((l, i) => i > sectionIndex && l.includes(':'));
  const sectionEnd = nextSectionIndex === -1 ? lines.length : nextSectionIndex;

  return lines
    .slice(sectionIndex + 1, sectionEnd)
    .filter(l => typeof marker === 'string' ? l.startsWith(marker) : marker.test(l))
    .map(l => l.replace(typeof marker === 'string' ? marker : /^\d+\.\s*/, '').trim());
}