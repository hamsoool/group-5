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
  calories?: number;
  protein?: string;
  carbs?: string;
  fat?: string;
  healthTips?: string[];
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
  const [customization, setCustomization] = useState({
    vegetarian: false,
    lowSalt: false,
    budgetFriendly: false,
  });
  const [showHealthTips, setShowHealthTips] = useState<Set<number>>(new Set());

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
        body: JSON.stringify({ 
          ingredients,
          customization 
        }),
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

  const toggleHealthTips = (index: number) => {
    setShowHealthTips(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const copyRecipe = (recipe: Recipe) => {
    const text = `${recipe.title}\n\nIngredients:\n${recipe.ingredients.join('\n')}\n\nInstructions:\n${recipe.instructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    alert('Recipe copied to clipboard!');
  };

  const printRecipe = (recipe: Recipe) => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${recipe.title}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #333; }
              h2 { color: #666; margin-top: 20px; }
              ul, ol { margin: 10px 0; }
              li { margin: 5px 0; }
            </style>
          </head>
          <body>
            <h1>${recipe.title}</h1>
            <p><strong>Prep Time:</strong> ${recipe.prepTime} | <strong>Cook Time:</strong> ${recipe.cookingTime} | <strong>Servings:</strong> ${recipe.servings}</p>
            <h2>Ingredients</h2>
            <ul>${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
            <h2>Instructions</h2>
            <ol>${recipe.instructions.map(inst => `<li>${inst}</li>`).join('')}</ol>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Recipe Customization Filters */}
      <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h3 className="mb-3 font-semibold text-black dark:text-white">Recipe Preferences</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={customization.vegetarian}
              onChange={(e) => setCustomization({ ...customization, vegetarian: e.target.checked })}
              className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">Vegetarian</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={customization.lowSalt}
              onChange={(e) => setCustomization({ ...customization, lowSalt: e.target.checked })}
              className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">Low Salt</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={customization.budgetFriendly}
              onChange={(e) => setCustomization({ ...customization, budgetFriendly: e.target.checked })}
              className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">Budget-Friendly</span>
          </label>
        </div>
      </div>

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
                {recipe.instructions && recipe.instructions.length > 0 ? (
                  <ol className="space-y-3">
                    {recipe.instructions.map((instruction, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-black text-xs text-white dark:bg-white dark:text-black">
                          {idx + 1}
                        </span>
                        <span className="text-zinc-700 dark:text-zinc-300">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-zinc-500">No instructions available</p>
                )}
              </div>

              {/* Nutrition Information */}
              {recipe.calories && (
                <div className="mb-4 rounded-md bg-green-50 p-3 dark:bg-green-900/20">
                  <h5 className="mb-2 font-semibold text-green-800 dark:text-green-200">Nutrition (per serving)</h5>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium text-green-700 dark:text-green-300">Calories:</span>{' '}
                      <span className="text-green-600 dark:text-green-400">{recipe.calories} kcal</span>
                    </div>
                    {recipe.protein && (
                      <div>
                        <span className="font-medium text-green-700 dark:text-green-300">Protein:</span>{' '}
                        <span className="text-green-600 dark:text-green-400">{recipe.protein}</span>
                      </div>
                    )}
                    {recipe.carbs && (
                      <div>
                        <span className="font-medium text-green-700 dark:text-green-300">Carbs:</span>{' '}
                        <span className="text-green-600 dark:text-green-400">{recipe.carbs}</span>
                      </div>
                    )}
                    {recipe.fat && (
                      <div>
                        <span className="font-medium text-green-700 dark:text-green-300">Fat:</span>{' '}
                        <span className="text-green-600 dark:text-green-400">{recipe.fat}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Health Tips Toggle */}
              {recipe.healthTips && recipe.healthTips.length > 0 && (
                <div className="mb-4">
                  <button
                    onClick={() => toggleHealthTips(index)}
                    className="mb-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {showHealthTips.has(index) ? '▼ Hide Health Tips' : '▶ Show Health Tips'}
                  </button>
                  {showHealthTips.has(index) && (
                    <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
                      <ul className="list-inside list-disc space-y-1 text-sm text-blue-800 dark:text-blue-200">
                        {recipe.healthTips.map((tip, tipIdx) => (
                          <li key={tipIdx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="mb-4 flex gap-2">
                <button
                  onClick={() => printRecipe(recipe)}
                  className="flex-1 rounded-md border border-zinc-300 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  🖨️ Print
                </button>
                <button
                  onClick={() => copyRecipe(recipe)}
                  className="flex-1 rounded-md border border-zinc-300 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  📋 Copy
                </button>
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