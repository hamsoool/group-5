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
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { ingredients, customization } = body;

    // Validate ingredients array
    if (!ingredients || !Array.isArray(ingredients)) {
      return NextResponse.json(
        { error: 'Ingredients must be an array' },
        { status: 400 }
      );
    }

    if (ingredients.length === 0) {
      return NextResponse.json(
        { error: 'No ingredients provided' },
        { status: 400 }
      );
    }

    if (ingredients.length < 3) {
      return NextResponse.json(
        { error: 'At least 3 ingredients are required' },
        { status: 400 }
      );
    }

    // Validate and sanitize each ingredient
    const validIngredients = ingredients
      .filter((i: any) => {
        if (!i || typeof i !== 'object') return false;
        if (!i.name || typeof i.name !== 'string' || i.name.trim().length === 0) return false;
        if (typeof i.quantity !== 'number' || i.quantity <= 0 || !isFinite(i.quantity)) return false;
        if (!i.unit || typeof i.unit !== 'string' || i.unit.trim().length === 0) return false;
        return true;
      })
      .map((i: any) => ({
        name: i.name.trim(),
        quantity: Math.max(0.1, Math.min(10000, i.quantity)),
        unit: i.unit.trim()
      }));

    if (validIngredients.length < 3) {
      return NextResponse.json(
        { error: 'At least 3 valid ingredients are required. Please check that all ingredients have valid names, quantities, and units.' },
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
    const ingredientList = validIngredients
      .map((i: any) => `${i.quantity} ${i.unit} ${i.name}`)
      .join(', ');

    // Build customization instructions with more detail
    let customizationText = '';
    const customizationDetails: string[] = [];
    
    if (customization) {
      if (customization.dishType) customizationDetails.push(`Dish Type: ${customization.dishType}`);
      if (customization.diet === 'Vegetarian') customizationDetails.push('Dietary Requirement: Vegetarian (no meat or fish)');
      if (customization.diet === 'Vegan') customizationDetails.push('Dietary Requirement: Vegan (no animal products)');
      if (customization.diet === 'Pescatarian') customizationDetails.push('Dietary Requirement: Pescatarian (no meat, fish/seafood allowed)');
      if (customization.diet === 'Keto') customizationDetails.push('Dietary Requirement: Keto (low-carb, high-fat)');
      if (customization.maxPrepTime) customizationDetails.push(`Time Constraint: Complete recipe in under ${customization.maxPrepTime} minutes total`);
      if (customization.budgetFriendly) customizationDetails.push('Cost Priority: Budget-friendly, use affordable and common ingredients');
      if (customization.healthFocused) customizationDetails.push('Health Priority: Nutritious, balanced, with health benefits emphasized');
      
      if (customizationDetails.length > 0) {
        customizationText = `\n\nCUSTOMIZATION REQUIREMENTS:\n${customizationDetails.join('\n')}`;
      }
    }

    const prompt = `You are a Filipino cooking expert creating authentic, traditional Filipino recipes. Your task is to generate 3 GENUINE Filipino recipes that Filipino families actually cook and eat regularly.

AVAILABLE INGREDIENTS TO USE:
${ingredientList}

${customizationText}

CRITICAL GUIDELINES FOR RECIPE GENERATION:
1. AUTHENTICITY: Only suggest REAL, well-known Filipino dishes that are commonly cooked in Filipino households
2. INGREDIENT MATCHING: Create recipes that meaningfully use the provided ingredients - don't force-fit ingredients
3. NO FUSION/EXPERIMENTAL: Avoid creative fusion or experimental recipes - stick to traditional Filipino cuisine
4. COOKING METHODS: Use simple, practical cooking techniques that Filipino cooks actually use
5. CULTURAL RELEVANCE: Each recipe should be a dish Filipinos eat regularly (e.g., Adobo, Sinigang, Pancit, Lumpia, Menudo)

EXCELLENT EXAMPLES OF RECIPES TO SUGGEST:
- Chicken/Pork Adobo (chicken/pork + soy sauce + vinegar + garlic)
- Sinigang na Baboy/Manok (pork/chicken + tamarind soup base + vegetables)
- Pancit Canton/Bihon (egg noodles/rice noodles + meat + vegetables)
- Filipino Spaghetti (spaghetti + hotdog + tomato sauce + cheese)
- Menudo (pork/beef + potatoes + tomato sauce + liver spread)
- Giniling (ground pork/beef + potatoes + carrots + peas + tomato sauce)
- Lumpia (spring rolls with pork/vegetables)
- Chicken Afritada (chicken + potatoes + carrots + cheese)
- Caldereta (beef/chicken + cheese + tomato sauce)
- Kare-Kare (oxtail/pork + peanut sauce + vegetables)

RESPONSE FORMAT - Return VALID JSON ONLY:
{
  "recipes": [
    {
      "title": "Authentic Filipino Dish Name",
      "description": "Brief description of what this dish is and why Filipinos love it",
      "ingredients": [
        "Ingredient 1 with quantity and preparation",
        "Ingredient 2 with quantity and preparation",
        "Ingredient 3 with quantity and preparation"
      ],
      "instructions": [
        "Step 1: Clear, simple instruction",
        "Step 2: Clear, simple instruction",
        "Step 3: Clear, simple instruction"
      ],
      "prepTime": "X mins",
      "cookingTime": "X mins",
      "servings": number,
      "cuisine": "Filipino",
      "difficulty": "Easy/Medium/Hard",
      "calories": number,
      "protein": "Xg",
      "carbs": "Xg",
      "fat": "Xg",
      "healthTips": [
        "Specific health benefit or tip for this recipe",
        "Nutritional highlight",
        "Serving suggestion or variation tip"
      ]
    }
  ]
}

QUALITY REQUIREMENTS:
- Generate exactly 3 recipes
- Each recipe MUST be a real Filipino dish
- Instructions should be clear, step-by-step, and practical
- Include realistic nutrition estimates
- Health tips should be specific and actionable
- All ingredients should logically connect to the final dish
- Respect dietary requirements if specified
- Estimated prep + cooking time should align with time constraints if specified

IMPORTANT REMINDERS:
- DO NOT invent new or experimental dishes
- DO NOT suggest non-Filipino cuisines
- DO NOT force ingredients that don't belong in the dish
- ONLY return valid JSON - no markdown, no extra text, no explanations
- Ensure JSON is properly formatted and parseable`;

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
          lastError = new Error('Invalid response format from Gemini - no JSON found');
          continue;
        }

        let responseData;
        try {
          responseData = JSON.parse(jsonMatch[0]);
        } catch (parseError) {
          lastError = new Error('Failed to parse JSON response from Gemini');
          continue;
        }
        
        // Validate response structure
        if (!responseData || typeof responseData !== 'object') {
          lastError = new Error('Invalid response structure from Gemini');
          continue;
        }

        if (!responseData.recipes || !Array.isArray(responseData.recipes)) {
          lastError = new Error('Recipes array missing or invalid in response');
          continue;
        }

        // Validate that we got at least some recipes (allow 1-3, not strictly 3)
        if (responseData.recipes.length === 0) {
          lastError = new Error('No recipes generated');
          continue;
        }

        // Validate each recipe has at least a title
        const validRecipes = responseData.recipes.filter((recipe: any) => {
          return recipe && 
                 typeof recipe === 'object' &&
                 recipe.title && 
                 typeof recipe.title === 'string' &&
                 recipe.title.trim().length > 0;
        });

        if (validRecipes.length === 0) {
          lastError = new Error('No valid recipes in response');
          continue;
        }

        // Return valid recipes (can be 1-3)
        return NextResponse.json({ recipes: validRecipes });
        
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