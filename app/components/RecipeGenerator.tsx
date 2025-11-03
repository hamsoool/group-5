import { useState } from 'react';

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  servings: number;
}

interface RecipeGeneratorProps {
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
    type: string;
  }>;
}

export default function RecipeGenerator({ ingredients }: RecipeGeneratorProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);

  const generateRecipe = async () => {
    if (ingredients.length === 0) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      });

      const data = await response.json();
      setRecipe(data);
    } catch (error) {
      console.error('Failed to generate recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={generateRecipe}
        disabled={ingredients.length === 0 || loading}
        className="w-full rounded-md bg-black py-2 text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {loading ? 'Generating...' : 'Generate Recipe'}
      </button>

      {recipe && (
        <div className="mt-4 space-y-4">
          <h3 className="text-xl font-bold">{recipe.title}</h3>
          <div>
            <h4 className="font-medium">Ingredients:</h4>
            <ul className="list-inside list-disc">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="text-zinc-600 dark:text-zinc-400">
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium">Instructions:</h4>
            <ol className="list-inside list-decimal">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="text-zinc-600 dark:text-zinc-400">
                  {instruction}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}