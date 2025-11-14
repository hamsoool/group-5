import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '@/config/api';

// Helper function to safely get error message
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

export async function POST(request: NextRequest) {
  try {
    const { ingredients, customization } = await request.json();

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'No ingredients provided' },
        { status: 400 }
      );
    }

    if (!config.gemini.apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    const ingredientList = ingredients
      .map((i: any) => `${i.quantity} ${i.unit} ${i.name}`)
      .join(', ');

    // Build customization instructions
    let customizationText = '';
    if (customization) {
      const prefs = [];
      if (customization.vegetarian) prefs.push('vegetarian (no meat or fish)');
      if (customization.lowSalt) prefs.push('low sodium (use minimal salt and salty ingredients)');
      if (customization.budgetFriendly) prefs.push('budget-friendly (use affordable, common ingredients)');
      
      if (prefs.length > 0) {
        customizationText = `\n\nCUSTOMIZATION REQUIREMENTS: Make these recipes ${prefs.join(', ')}.`;
      }
    }

    const prompt = `Generate 3 common, traditional FILIPINO recipes using these ingredients: ${ingredientList}${customizationText}

IMPORTANT RULES:
1. Only suggest REAL, WELL-KNOWN Filipino dishes that people commonly cook at home
2. Match the ingredients to POPULAR Filipino recipes (e.g., ground pork + tomato sauce = Filipino Spaghetti, ham + cream = Carbonara, chicken + soy sauce = Chicken Adobo)
3. DO NOT create unusual, experimental, or creative fusion recipes
4. Use simple, practical cooking methods that Filipinos actually use
5. Each recipe should be a dish that Filipino families regularly make
6. Include nutrition information and health tips for each recipe

Examples of what to suggest:
- Filipino Spaghetti (sweet style with hotdog)
- Carbonara (creamy pasta)
- Adobo (chicken or pork)
- Sinigang (sour soup)
- Menudo (tomato-based stew)
- Afritada (tomato-based with vegetables)
- Giniling (ground meat with tomato sauce)
- Pancit Canton/Bihon (stir-fried noodles)

Please respond in JSON format with exactly this structure:
{
  "recipes": [
    {
      "title": "Common Filipino Dish Name 1 (e.g., Filipino Spaghetti)",
      "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3"],
      "instructions": ["step 1", "step 2", "step 3"],
      "prepTime": "X mins",
      "cookingTime": "X mins",
      "servings": number,
      "cuisine": "Filipino",
      "difficulty": "Easy/Medium/Hard",
      "calories": number,
      "protein": "Xg",
      "carbs": "Xg",
      "fat": "Xg",
      "healthTips": ["health tip 1", "health tip 2", "health tip 3"]
    },
    {
      "title": "Common Filipino Dish Name 2 (e.g., Carbonara)", 
      "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3"],
      "instructions": ["step 1", "step 2", "step 3"],
      "prepTime": "X mins",
      "cookingTime": "X mins", 
      "servings": number,
      "cuisine": "Filipino",
      "difficulty": "Easy/Medium/Hard",
      "calories": number,
      "protein": "Xg",
      "carbs": "Xg",
      "fat": "Xg",
      "healthTips": ["health tip 1", "health tip 2"]
    },
    {
      "title": "Common Filipino Dish Name 3 (e.g., Adobo)",
      "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3"],
      "instructions": ["step 1", "step 2", "step 3"],
      "prepTime": "X mins",
      "cookingTime": "X mins",
      "servings": number,
      "cuisine": "Filipino",
      "difficulty": "Easy/Medium/Hard",
      "calories": number,
      "protein": "Xg",
      "carbs": "Xg",
      "fat": "Xg",
      "healthTips": ["health tip 1", "health tip 2", "health tip 3"]
    }
  ]
}

IMPORTANT: 
- Make sure the response is valid JSON only, no other text
- Only suggest REAL, COMMONLY COOKED Filipino dishes that match the ingredients provided
- Include estimated nutrition info per serving (calories, protein, carbs, fat)
- Provide 2-3 health tips or nutritional insights for each recipe`;

    // Use your available models in priority order
    const models = [
      'gemini-2.5-flash',    // Has usage shown in dashboard
      'gemini-2.0-flash',    // Available with 15 RPM
      'gemini-2.5-pro',      // Available but limited (2 RPM)
    ];

    let lastError: Error | null = null;
    
    for (const modelName of models) {
      try {
        console.log(`Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Clean the response and extract JSON
        const cleanedText = text.replace(/```json|```/g, '').trim();
        const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) {
          lastError = new Error('Invalid response format from Gemini');
          continue;
        }

        const responseData = JSON.parse(jsonMatch[0]);
        
        // Validate that we got 3 recipes
        if (responseData.recipes && Array.isArray(responseData.recipes) && responseData.recipes.length === 3) {
          return NextResponse.json(responseData);
        } else {
          lastError = new Error('Did not receive exactly 3 recipes');
          continue;
        }
        
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.log(`Model ${modelName} failed:`, errorMessage);
        lastError = error instanceof Error ? error : new Error(errorMessage);
        // Continue to next model
      }
    }

    // If all models fail, throw the last error
    throw lastError || new Error('All models failed to generate recipes');

  } catch (error) {
    console.error('Error generating recipes:', error);
    
    const errorMessage = getErrorMessage(error);
    
    // Check for specific error types
    if (errorMessage.includes('429') || errorMessage.includes('quota')) {
      return NextResponse.json(
        { 
          error: 'Recipe generation service is currently unavailable due to rate limits. Please try again later.',
          code: 'RATE_LIMITED'
        },
        { status: 429 }
      );
    }
    
    if (errorMessage.includes('404')) {
      return NextResponse.json(
        { 
          error: 'Recipe generation service is temporarily unavailable.',
          code: 'MODEL_UNAVAILABLE'
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}