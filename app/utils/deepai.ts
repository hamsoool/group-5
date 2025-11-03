import { auth } from '../utils/firebase';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Get API key from Firebase config with type checking
const apiKey = auth.app.options.apiKey;
if (!apiKey) {
  throw new Error('Firebase API key is not configured');
}

// Initialize the AI model with verified API key
const genAI = new GoogleGenerativeAI(apiKey);

interface Ingredient {
  quantity: number;
  unit: string;
  name: string;
  type: string;
}

export async function generateRecipe(ingredients: Ingredient[]): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const mainIngredient = ingredients[0].name;
    const otherIngredients = ingredients.slice(1);

    const prompt = `Create a delicious recipe for ${mainIngredient}${
      otherIngredients.length > 0 ? ` with ${otherIngredients.map(i => i.name).join(', ')}` : ''
    }.

Create a complete recipe following this exact format:
Title: [Dish name]
Servings: [Number]
Prep Time: [Time in minutes]
Cooking Time: [Time in minutes]

Ingredients:
${ingredients.map(i => `- ${i.quantity} ${i.unit} ${i.name}`).join('\n')}

Instructions:
1. [First step]
2. [Second step]
3. [Continue with detailed steps]

Note: Include specific temperatures and cooking times for food safety.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    if (!response) {
      throw new Error('Invalid or empty response from Firebase AI');
    }

    // Clean up the response
    const cleanedOutput = response.text()
      .trim()
      .replace(/\n{3,}/g, '\n\n')  // Remove excess newlines
      .replace(/^\s*\n/gm, '\n');   // Remove empty lines

    // Validate the response format
    if (!cleanedOutput.includes('Title:') || !cleanedOutput.includes('Instructions:')) {
      throw new Error('Recipe format validation failed');
    }

    return cleanedOutput;
  } catch (error) {
    console.error('Firebase AI Recipe Generation Error:', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : String(error)
    });
    throw error;
  }
}