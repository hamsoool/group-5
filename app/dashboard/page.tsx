// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import IngredientManager from '@/app/components/IngredientManager';
import RecipeGenerator from '@/app/components/RecipeGenerator';

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  type: 'meat' | 'vegetable' | 'fish' | 'other';
}

interface Recipe {
  id: string;
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

export default function DashboardPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Check authentication and load recipes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadRecipes(currentUser.uid);
      } else {
        router.push('/auth/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const loadRecipes = async (userId: string) => {
    try {
      const recipesCollection = collection(db, 'recipes');
      const q = query(recipesCollection, where('userId', '==', userId));
      const recipesSnapshot = await getDocs(q);
      const recipesList = recipesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Recipe));
      setSavedRecipes(recipesList);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = async (recipe: Omit<Recipe, 'id'> & { id?: string }) => {
    if (!user) return;

    try {
      const recipesCollection = collection(db, 'recipes');
      const docRef = await addDoc(recipesCollection, {
        userId: user.uid,
        title: recipe.title,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        prepTime: recipe.prepTime,
        cookingTime: recipe.cookingTime,
        servings: recipe.servings,
        cuisine: recipe.cuisine,
        difficulty: recipe.difficulty,
        calories: recipe.calories,
        protein: recipe.protein,
        carbs: recipe.carbs,
        fat: recipe.fat,
        healthTips: recipe.healthTips,
        createdAt: new Date().toISOString()
      });
      
      const newRecipe = {
        id: docRef.id,
        ...recipe
      } as Recipe;
      
      setSavedRecipes([...savedRecipes, newRecipe]);
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Failed to save recipe. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'recipes', id));
      setSavedRecipes(savedRecipes.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Failed to delete recipe. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-6xl flex-col items-center px-6 py-16 sm:px-16">
        <div className="mb-6 flex w-full items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold text-black dark:text-zinc-50">
              Welcome to CookBot!
            </h1>
            {user && (
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Logged in as: {user.email}
              </p>
            )}
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-md bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
          >
            Logout
          </button>
        </div>
        <p className="mb-8 max-w-2xl text-xl text-zinc-600 dark:text-zinc-400">
          Start generating recipes below by adding ingredients.
        </p>

        <div className="grid w-full max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="mb-4 text-2xl font-bold">Add Ingredients</h2>
            <IngredientManager onIngredientsChange={setIngredients} />
          </div>

          <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="mb-4 text-2xl font-bold">Generate Recipe</h2>
            <RecipeGenerator ingredients={ingredients} onSaveRecipe={handleSaveRecipe} />
          </div>

          <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800 md:col-span-2 lg:col-span-1">
            <h2 className="mb-4 text-2xl font-bold">Saved Recipes ({savedRecipes.length})</h2>
            <div className="max-h-96 space-y-3 overflow-y-auto">
              {loading ? (
                <p className="text-zinc-600 dark:text-zinc-400">Loading recipes...</p>
              ) : savedRecipes.length === 0 ? (
                <p className="text-zinc-600 dark:text-zinc-400">No saved recipes yet.</p>
              ) : (
                savedRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="rounded-md border border-zinc-200 p-3 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800/50"
                  >
                    <div className="flex items-start justify-between">
                      <button
                        onClick={() => setSelectedRecipe(recipe)}
                        className="flex-1 text-left"
                      >
                        <h3 className="font-semibold text-black dark:text-white">{recipe.title}</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {recipe.servings} servings • {recipe.prepTime}
                        </p>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRecipe(recipe.id);
                        }}
                        className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recipe Detail Modal */}
        {selectedRecipe && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelectedRecipe(null)}
          >
            <div
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 dark:bg-zinc-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-start justify-between">
                <h2 className="text-3xl font-bold text-black dark:text-white">
                  {selectedRecipe.title}
                </h2>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="text-2xl text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6 flex gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                <span>⏱️ Prep: {selectedRecipe.prepTime}</span>
                <span>🍳 Cook: {selectedRecipe.cookingTime}</span>
                <span>🍽️ Serves: {selectedRecipe.servings}</span>
              </div>

              <div className="mb-6">
                <h3 className="mb-3 text-xl font-semibold text-black dark:text-white">Ingredients:</h3>
                <ul className="list-inside list-disc space-y-2">
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-zinc-700 dark:text-zinc-300">
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="mb-3 text-xl font-semibold text-black dark:text-white">Instructions:</h3>
                <ol className="space-y-3">
                  {selectedRecipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-black text-xs text-white dark:bg-white dark:text-black">
                        {index + 1}
                      </span>
                      <span className="text-zinc-700 dark:text-zinc-300">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Nutrition Information in Modal */}
              {selectedRecipe.calories && (
                <div className="mb-6 rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                  <h3 className="mb-3 text-xl font-semibold text-green-800 dark:text-green-200">Nutrition (per serving)</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="font-medium text-green-700 dark:text-green-300">Calories:</span>{' '}
                      <span className="text-green-600 dark:text-green-400">{selectedRecipe.calories} kcal</span>
                    </div>
                    {selectedRecipe.protein && (
                      <div>
                        <span className="font-medium text-green-700 dark:text-green-300">Protein:</span>{' '}
                        <span className="text-green-600 dark:text-green-400">{selectedRecipe.protein}</span>
                      </div>
                    )}
                    {selectedRecipe.carbs && (
                      <div>
                        <span className="font-medium text-green-700 dark:text-green-300">Carbs:</span>{' '}
                        <span className="text-green-600 dark:text-green-400">{selectedRecipe.carbs}</span>
                      </div>
                    )}
                    {selectedRecipe.fat && (
                      <div>
                        <span className="font-medium text-green-700 dark:text-green-300">Fat:</span>{' '}
                        <span className="text-green-600 dark:text-green-400">{selectedRecipe.fat}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Health Tips in Modal */}
              {selectedRecipe.healthTips && selectedRecipe.healthTips.length > 0 && (
                <div className="mb-6 rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
                  <h3 className="mb-3 text-xl font-semibold text-blue-800 dark:text-blue-200">Health Tips</h3>
                  <ul className="list-inside list-disc space-y-2 text-blue-800 dark:text-blue-200">
                    {selectedRecipe.healthTips.map((tip, tipIdx) => (
                      <li key={tipIdx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => setSelectedRecipe(null)}
                className="mt-6 w-full rounded-md bg-black py-2 text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}