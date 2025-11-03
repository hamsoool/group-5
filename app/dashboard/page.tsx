'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../utils/firebase';
import IngredientManager from '../components/IngredientManager';
import RecipeGenerator from '../components/RecipeGenerator';

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
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

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/auth/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleGenerateRecipe = async () => {
    if (ingredients.length === 0) {
      setError('Please add some ingredients first');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate recipe');
      }

      const data = await response.json();
      setRecipe(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate recipe');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-xl text-zinc-800 dark:text-zinc-200">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6 dark:bg-black">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-black dark:text-white">My Kitchen</h1>
          <button
            onClick={() => auth.signOut()}
            className="rounded-full border border-black px-4 py-2 text-black transition-colors hover:bg-zinc-100 dark:border-white dark:text-white dark:hover:bg-zinc-900"
          >
            Sign Out
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
              Available Ingredients
            </h2>
            <IngredientManager onIngredientsChange={setIngredients} />
          </div>

          <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
              Recipe Generator
            </h2>
            {error && (
              <p className="mb-4 text-red-500">{error}</p>
            )}
            <button
              onClick={handleGenerateRecipe}
              disabled={generating || ingredients.length === 0}
              className="w-full rounded-md bg-black py-2 text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              {generating ? 'Generating...' : 'Generate Recipe'}
            </button>

            {recipe && (
              <div className="mt-6 space-y-4">
                <h3 className="text-xl font-bold">{recipe.title}</h3>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  Serves: {recipe.servings} | Prep: {recipe.prepTime} | Cook: {recipe.cookingTime}
                </div>
                <div>
                  <h4 className="font-medium">Ingredients:</h4>
                  <ul className="ml-4 list-disc space-y-1">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="text-zinc-600 dark:text-zinc-400">
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Instructions:</h4>
                  <ol className="ml-4 list-decimal space-y-2">
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

          <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
              Saved Recipes
            </h2>
            <div className="text-zinc-600 dark:text-zinc-400">
              No saved recipes yet.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}