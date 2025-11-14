'use client';

import { useState } from 'react';

interface Recipe {
  id?: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookingTime: string;
  servings: number;
  cuisine?: string;
  difficulty?: string;
}

interface RecipeResponse {
  recipes: Recipe[];
}

interface RecipeGeneratorProps {
  ingredients: Array<{
    id: string;
    name: string;
    quantity: number;
    unit: string;
    type: string;
  }>;
  onSaveRecipe?: (recipe: Recipe) => void;
}

export default function RecipeGenerator({ ingredients, onSaveRecipe }: RecipeGeneratorProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Set<string>>(new Set());

  const generateRecipe = async () => {
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient');
      return;
    }

    setLoading(true);
    setError(null);
    setRecipes([]);
    setSavedRecipes(new Set());

    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data: RecipeResponse = await response.json();
      
      // Validate the response data
      if (!data || !data.recipes || !Array.isArray(data.recipes) || data.recipes.length === 0) {
        throw new Error('Invalid recipe format received');
      }
      
      setRecipes(data.recipes);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate recipes';
      setError(message);
      console.error('Recipe generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveRecipe = (recipe: Recipe, index: number) => {
    if (onSaveRecipe) {
      const savedRecipe = {
        ...recipe,
        id: `${Date.now()}-${index}`
      };
      onSaveRecipe(savedRecipe);
      setSavedRecipes(prev => new Set(prev).add(index.toString()));
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={generateRecipe}
        disabled={ingredients.length === 0 || loading}
        className="w-full rounded-md bg-black py-3 text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        {loading ? 'Generating Recipes...' : 'Generate 3 Recipes'}
      </button>

      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-red-700 dark:border-red-700 dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      {recipes.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-black dark:text-white">
            {recipes.length} Recipes Generated
          </h3>
          
          {recipes.map((recipe, index) => (
            <div 
              key={index}
              className="rounded-md border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="mb-4">
                <h4 className="text-xl font-bold text-black dark:text-white">
                  {recipe.title}
                </h4>
                {recipe.cuisine && (
                  <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {recipe.cuisine}
                  </span>
                )}
                {recipe.difficulty && (
                  <span className="ml-2 inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                    {recipe.difficulty}
                  </span>
                )}
              </div>
              
              <div className="mb-4 flex gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                <span>⏱️ Prep: {recipe.prepTime}</span>
                <span>🍳 Cook: {recipe.cookingTime}</span>
                <span>🍽️ Serves: {recipe.servings}</span>
              </div>

              <div className="mb-4">
                <h5 className="mb-2 font-semibold text-black dark:text-white">Ingredients:</h5>
                <ul className="list-inside list-disc space-y-1">
                  {recipe.ingredients && recipe.ingredients.length > 0 ? (
                    recipe.ingredients.map((ingredient, idx) => (
                      <li key={idx} className="text-zinc-700 dark:text-zinc-300">
                        {ingredient}
                      </li>
                    ))
                  ) : (
                    <li className="text-zinc-500">No ingredients listed</li>
                  )}
                </ul>
              </div>

              <div className="mb-4">
                <h5 className="mb-2 font-semibold text-black dark:text-white">Instructions:</h5>
                <ol className="list-inside list-decimal space-y-2">
                  {recipe.instructions && recipe.instructions.length > 0 ? (
                    recipe.instructions.map((instruction, idx) => (
                      <li key={idx} className="text-zinc-700 dark:text-zinc-300">
                        {instruction}
                      </li>
                    ))
                  ) : (
                    <li className="text-zinc-500">No instructions listed</li>
                  )}
                </ol>
              </div>

              {onSaveRecipe && (
                <button
                  onClick={() => saveRecipe(recipe, index)}
                  disabled={savedRecipes.has(index.toString())}
                  className="w-full rounded-md bg-green-600 py-2 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-green-500 dark:hover:bg-green-600"
                >
                  {savedRecipes.has(index.toString()) ? '✓ Recipe Saved!' : 'Save This Recipe'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}