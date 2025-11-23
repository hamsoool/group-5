'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { RecipeCard } from './RecipeCard';

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

  // Check if ingredients contain meat or fish
  const hasMeatOrFish = ingredients.some(
    (ingredient) => ingredient.type === 'meat' || ingredient.type === 'fish'
  );

  // Auto-disable vegetarian if meat/fish is added
  if (hasMeatOrFish && customization.vegetarian) {
    setCustomization({ ...customization, vegetarian: false });
  }

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

  return (
    <div className="space-y-6">
      {/* Recipe Customization Filters */}
      <Card className="border-none shadow-sm dark:bg-card/50">
        <CardContent className="pt-6">
          <h3 className="mb-3 font-semibold tracking-tight">Recipe Preferences</h3>
          <div className="space-y-2">
            <label className={`flex items-center gap-2 ${hasMeatOrFish ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
              <input
                type="checkbox"
                checked={customization.vegetarian}
                onChange={(e) => setCustomization({ ...customization, vegetarian: e.target.checked })}
                disabled={hasMeatOrFish}
                className="h-4 w-4 rounded border-input disabled:cursor-not-allowed"
              />
              <span className="text-sm text-muted-foreground/80">
                Vegetarian
                {hasMeatOrFish && <span className="ml-2 text-xs text-red-500">(Contains meat/fish)</span>}
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={customization.lowSalt}
                onChange={(e) => setCustomization({ ...customization, lowSalt: e.target.checked })}
                className="h-4 w-4 rounded border-input"
              />
              <span className="text-sm text-muted-foreground/80">Low Salt</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={customization.budgetFriendly}
                onChange={(e) => setCustomization({ ...customization, budgetFriendly: e.target.checked })}
                className="h-4 w-4 rounded border-input"
              />
              <span className="text-sm text-muted-foreground/80">Budget-Friendly</span>
            </label>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={generateRecipe}
        disabled={ingredients.length === 0 || loading}
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transition-all"
        size="lg"
      >
        {loading ? (
          <>
            <Sparkles className="w-4 h-4 mr-2 animate-spin" strokeWidth={2} />
            Generating Your Recipes...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" strokeWidth={2} />
            Generate 3 Recipes
          </>
        )}
      </Button>

      {error && (
        <Card className="border-destructive/50 bg-destructive/10 dark:bg-destructive/20">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {recipes.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-3xl tracking-tight">Your Recipes are Ready!</h2>
              <p className="text-muted-foreground/80">
                {recipes.length} delicious recipe{recipes.length > 1 ? 's' : ''} generated
              </p>
            </div>
          </div>
          
          {recipes.map((recipe, index) => (
            <div key={index} className="space-y-4">
              <RecipeCard recipe={recipe} />
              {onSaveRecipe && (
                <Button
                  onClick={() => saveRecipe(recipe, index)}
                  disabled={savedRecipes.has(index.toString())}
                  variant={savedRecipes.has(index.toString()) ? "secondary" : "default"}
                  className="w-full"
                >
                  {savedRecipes.has(index.toString()) ? '✓ Recipe Saved!' : 'Save This Recipe'}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
