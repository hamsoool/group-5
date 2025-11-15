'use client';

import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  type: 'meat' | 'vegetable' | 'fish' | 'other';
}

const UNITS = ['g', 'kg', 'cup', 'tbsp', 'tsp', 'ml', 'L', 'piece'];
const TYPES = ['meat', 'vegetable', 'fish', 'other'] as const;

type IngredientType = typeof TYPES[number];

interface IngredientManagerProps {
  onIngredientsChange: (ingredients: Ingredient[]) => void;
}

export default function IngredientManager({ onIngredientsChange }: IngredientManagerProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredient, setNewIngredient] = useState<{
    name: string;
    quantity: number;
    unit: string;
    type: IngredientType;
  }>({
    name: '',
    quantity: 0,
    unit: 'g',
    type: 'other'
  });

  const MIN_INGREDIENTS = 3;

  const addIngredient = () => {
    if (newIngredient.name && newIngredient.quantity) {
      setIngredients([
        ...ingredients,
        { id: Date.now().toString(), ...newIngredient }
      ]);
      setNewIngredient({
        name: '',
        quantity: 0,
        unit: 'g',
        type: 'other'
      });
    }
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  useEffect(() => {
    onIngredientsChange(ingredients);
  }, [ingredients, onIngredientsChange]);

  return (
    <div className="space-y-4">
      <Card className={`border-blue-100 dark:border-blue-900 ${ingredients.length < MIN_INGREDIENTS ? 'bg-blue-50/80 dark:bg-blue-950/30' : 'bg-green-50/80 dark:bg-green-950/30 border-green-100 dark:border-green-900'}`}>
        <CardContent className="pt-6">
          <p className={`text-sm font-medium ${ingredients.length < MIN_INGREDIENTS ? 'text-blue-800 dark:text-blue-200' : 'text-green-800 dark:text-green-200'}`}>
            {ingredients.length < MIN_INGREDIENTS 
              ? `Add at least ${MIN_INGREDIENTS} main ingredients (${ingredients.length}/${MIN_INGREDIENTS})`
              : `Great! You have ${ingredients.length} ingredient${ingredients.length > 1 ? 's' : ''}. You can add more if needed.`
            }
          </p>
        </CardContent>
      </Card>
      
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Ingredient name"
          value={newIngredient.name}
          onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
          className="shadow-sm"
        />
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Amount"
            className="w-24 shadow-sm"
            value={newIngredient.quantity || ''}
            onChange={(e) => setNewIngredient({ ...newIngredient, quantity: parseFloat(e.target.value) })}
          />
          <select
            className="flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={newIngredient.unit}
            onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
          >
            {UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={newIngredient.type}
            onChange={(e) => setNewIngredient({ ...newIngredient, type: e.target.value as IngredientType })}
          >
            {TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Button
        onClick={addIngredient}
        disabled={!newIngredient.name || !newIngredient.quantity}
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transition-all"
        size="lg"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Ingredient
      </Button>

      {ingredients.length > 0 && (
        <div className="space-y-2">
          {ingredients.map((ingredient) => (
            <Badge
              key={ingredient.id}
              variant="secondary"
              className="w-full justify-between px-3.5 py-2 cursor-pointer hover:bg-secondary/80 transition-colors shadow-sm"
            >
              <span className="tracking-wide">
                {ingredient.name} - {ingredient.quantity} {ingredient.unit} ({ingredient.type})
              </span>
              <button
                onClick={() => removeIngredient(ingredient.id)}
                className="ml-2.5 hover:text-destructive transition-colors"
                aria-label={`Remove ${ingredient.name}`}
              >
                <X className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
