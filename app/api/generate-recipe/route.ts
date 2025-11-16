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

// Response validation schema
interface ValidatedRecipe {
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookingTime?: string;
  servings: number;
  cuisine?: string;
  difficulty?: string;
  calories?: number;
  protein?: string;
  carbs?: string;
  fat?: string;
  healthTips?: string[];
}

// Comprehensive response validator
const validateAndCleanRecipeResponse = (recipe: any): { valid: boolean; recipe?: ValidatedRecipe; errors: string[] } => {
  const errors: string[] = [];
  
  // Validate title (required)
  if (!recipe.title || typeof recipe.title !== 'string') {
    errors.push('Recipe title is missing or not a string');
  } else if (recipe.title.trim().length === 0) {
    errors.push('Recipe title is empty');
  } else if (recipe.title.length > 200) {
    errors.push('Recipe title exceeds 200 characters');
  }
  
  // Validate description (optional)
  if (recipe.description !== undefined && recipe.description !== null) {
    if (typeof recipe.description !== 'string') {
      errors.push('Recipe description must be a string');
    } else if (recipe.description.length > 500) {
      errors.push('Recipe description exceeds 500 characters');
    }
  }
  
  // Validate ingredients (required, array of strings)
  if (!Array.isArray(recipe.ingredients)) {
    errors.push('Ingredients must be an array');
  } else if (recipe.ingredients.length === 0) {
    errors.push('Recipe must have at least one ingredient');
  } else if (recipe.ingredients.length > 50) {
    errors.push('Recipe has too many ingredients (max 50)');
  } else {
    recipe.ingredients.forEach((ing: any, idx: number) => {
      if (typeof ing !== 'string' || ing.trim().length === 0) {
        errors.push(`Ingredient ${idx + 1} is invalid or empty`);
      } else if (ing.length > 200) {
        errors.push(`Ingredient ${idx + 1} exceeds 200 characters`);
      }
    });
  }
  
  // Validate instructions (required, array of strings)
  if (!Array.isArray(recipe.instructions)) {
    errors.push('Instructions must be an array');
  } else if (recipe.instructions.length === 0) {
    errors.push('Recipe must have at least one instruction');
  } else if (recipe.instructions.length > 50) {
    errors.push('Recipe has too many instructions (max 50)');
  } else {
    recipe.instructions.forEach((inst: any, idx: number) => {
      if (typeof inst !== 'string' || inst.trim().length === 0) {
        errors.push(`Instruction ${idx + 1} is invalid or empty`);
      } else if (inst.length > 500) {
        errors.push(`Instruction ${idx + 1} exceeds 500 characters`);
      }
    });
  }
  
  // Validate prepTime (required string)
  if (!recipe.prepTime || typeof recipe.prepTime !== 'string') {
    errors.push('Prep time is required and must be a string');
  } else if (recipe.prepTime.length > 50) {
    errors.push('Prep time exceeds 50 characters');
  }
  
  // Validate cookingTime (optional string)
  if (recipe.cookingTime !== undefined && recipe.cookingTime !== null) {
    if (typeof recipe.cookingTime !== 'string') {
      errors.push('Cooking time must be a string');
    } else if (recipe.cookingTime.length > 50) {
      errors.push('Cooking time exceeds 50 characters');
    }
  }
  
  // Validate servings (required number)
  if (typeof recipe.servings !== 'number') {
    errors.push('Servings must be a number');
  } else if (recipe.servings < 1 || recipe.servings > 100) {
    errors.push('Servings must be between 1 and 100');
  }
  
  // Validate cuisine (optional string)
  if (recipe.cuisine !== undefined && recipe.cuisine !== null) {
    if (typeof recipe.cuisine !== 'string') {
      errors.push('Cuisine must be a string');
    } else if (recipe.cuisine.length > 50) {
      errors.push('Cuisine exceeds 50 characters');
    }
  }
  
  // Validate difficulty (optional string)
  if (recipe.difficulty !== undefined && recipe.difficulty !== null) {
    if (typeof recipe.difficulty !== 'string') {
      errors.push('Difficulty must be a string');
    } else if (!['Easy', 'Medium', 'Hard'].includes(recipe.difficulty)) {
      errors.push('Difficulty must be Easy, Medium, or Hard');
    }
  }
  
  // Validate calories (optional number)
  if (recipe.calories !== undefined && recipe.calories !== null) {
    if (typeof recipe.calories !== 'number') {
      errors.push('Calories must be a number');
    } else if (recipe.calories < 0 || recipe.calories > 5000) {
      errors.push('Calories must be between 0 and 5000');
    }
  }
  
  // Validate protein (optional string)
  if (recipe.protein !== undefined && recipe.protein !== null) {
    if (typeof recipe.protein !== 'string') {
      errors.push('Protein must be a string');
    } else if (recipe.protein.length > 50) {
      errors.push('Protein exceeds 50 characters');
    }
  }
  
  // Validate carbs (optional string)
  if (recipe.carbs !== undefined && recipe.carbs !== null) {
    if (typeof recipe.carbs !== 'string') {
      errors.push('Carbs must be a string');
    } else if (recipe.carbs.length > 50) {
      errors.push('Carbs exceeds 50 characters');
    }
  }
  
  // Validate fat (optional string)
  if (recipe.fat !== undefined && recipe.fat !== null) {
    if (typeof recipe.fat !== 'string') {
      errors.push('Fat must be a string');
    } else if (recipe.fat.length > 50) {
      errors.push('Fat exceeds 50 characters');
    }
  }
  
  // Validate healthTips (optional array of strings)
  if (recipe.healthTips !== undefined && recipe.healthTips !== null) {
    if (!Array.isArray(recipe.healthTips)) {
      errors.push('Health tips must be an array');
    } else if (recipe.healthTips.length > 20) {
      errors.push('Too many health tips (max 20)');
    } else {
      recipe.healthTips.forEach((tip: any, idx: number) => {
        if (typeof tip !== 'string' || tip.trim().length === 0) {
          errors.push(`Health tip ${idx + 1} is invalid or empty`);
        } else if (tip.length > 200) {
          errors.push(`Health tip ${idx + 1} exceeds 200 characters`);
        }
      });
    }
  }
  
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  // Build cleaned recipe object
  const cleanedRecipe: ValidatedRecipe = {
    title: recipe.title.trim(),
    ingredients: recipe.ingredients.map((ing: string) => ing.trim()).filter((ing: string) => ing.length > 0),
    instructions: recipe.instructions.map((inst: string) => inst.trim()).filter((inst: string) => inst.length > 0),
    prepTime: recipe.prepTime.trim(),
    servings: Math.round(recipe.servings),
    cuisine: recipe.cuisine ? recipe.cuisine.trim() : undefined,
  };
  
  // Add optional fields if they exist and are valid
  if (recipe.description && typeof recipe.description === 'string' && recipe.description.trim()) {
    cleanedRecipe.description = recipe.description.trim();
  }
  if (recipe.cookingTime && typeof recipe.cookingTime === 'string' && recipe.cookingTime.trim()) {
    cleanedRecipe.cookingTime = recipe.cookingTime.trim();
  }
  if (recipe.difficulty) {
    cleanedRecipe.difficulty = recipe.difficulty;
  }
  if (typeof recipe.calories === 'number' && recipe.calories > 0) {
    cleanedRecipe.calories = Math.round(recipe.calories);
  }
  if (recipe.protein) {
    cleanedRecipe.protein = recipe.protein;
  }
  if (recipe.carbs) {
    cleanedRecipe.carbs = recipe.carbs;
  }
  if (recipe.fat) {
    cleanedRecipe.fat = recipe.fat;
  }
  if (Array.isArray(recipe.healthTips) && recipe.healthTips.length > 0) {
    cleanedRecipe.healthTips = recipe.healthTips
      .map((tip: string) => tip.trim())
      .filter((tip: string) => tip.length > 0);
  }
  
  return { valid: true, recipe: cleanedRecipe, errors: [] };
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

        if (responseData.recipes.length > 5) {
          lastError = new Error(`Generated ${responseData.recipes.length} recipes, but maximum is 5`);
          continue;
        }

        // Validate and clean each recipe using strict validation
        const validRecipes: ValidatedRecipe[] = [];
        const validationErrors: { [key: number]: string[] } = {};
        
        responseData.recipes.forEach((recipe: any, index: number) => {
          const validation = validateAndCleanRecipeResponse(recipe);
          
          if (!validation.valid) {
            validationErrors[index] = validation.errors;
            console.warn(`Recipe ${index + 1} validation failed:`, validation.errors.join('; '));
          } else if (validation.recipe) {
            validRecipes.push(validation.recipe);
          }
        });

        if (validRecipes.length === 0) {
          const errorMessages = Object.entries(validationErrors)
            .map(([idx, errors]) => `Recipe ${parseInt(idx) + 1}: ${errors[0]}`)
            .join('; ');
          lastError = new Error(`All recipes failed validation: ${errorMessages}`);
          console.warn('All recipes failed validation:', validationErrors);
          continue;
        }

        // Log validation summary
        const failedCount = responseData.recipes.length - validRecipes.length;
        if (failedCount > 0) {
          console.warn(`Generated ${validRecipes.length} valid recipe(s) out of ${responseData.recipes.length}`);
        }

        // Return validated and cleaned recipes
        return NextResponse.json({ 
          recipes: validRecipes,
          validationInfo: {
            totalProcessed: responseData.recipes.length,
            validRecipes: validRecipes.length,
            failedValidations: failedCount
          }
        });
        
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