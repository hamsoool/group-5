'use client';

import { useEffect, useState } from 'react';

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

  const MAX_INGREDIENTS = 3;

  const addIngredient = () => {
    if (ingredients.length >= MAX_INGREDIENTS) {
      return;
    }
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
      <div className="mb-3 rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
          Add 3 main ingredients ({ingredients.length}/{MAX_INGREDIENTS})
        </p>
      </div>
      
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Ingredient name"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
          value={newIngredient.name}
          onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
          disabled={ingredients.length >= MAX_INGREDIENTS}
        />
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Amount"
            className="w-24 rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
            value={newIngredient.quantity || ''}
            onChange={(e) => setNewIngredient({ ...newIngredient, quantity: parseFloat(e.target.value) })}
            disabled={ingredients.length >= MAX_INGREDIENTS}
          />
          <select
            className="rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
            value={newIngredient.unit}
            onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
            disabled={ingredients.length >= MAX_INGREDIENTS}
          >
            {UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
          <select
            className="rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
            value={newIngredient.type}
            onChange={(e) => setNewIngredient({ ...newIngredient, type: e.target.value as IngredientType })}
            disabled={ingredients.length >= MAX_INGREDIENTS}
          >
            {TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        onClick={addIngredient}
        disabled={ingredients.length >= MAX_INGREDIENTS}
        className="w-full rounded-md bg-black py-2 text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        {ingredients.length >= MAX_INGREDIENTS ? 'Max Ingredients Reached' : 'Add Ingredient'}
      </button>

      <ul className="max-h-64 space-y-2 overflow-y-auto">
        {ingredients.map((ingredient) => (
          <li
            key={ingredient.id}
            className="flex justify-between items-center rounded-md border border-zinc-200 p-2 dark:border-zinc-800"
          >
            <span>{ingredient.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 text-sm">
                {ingredient.quantity} {ingredient.unit} ({ingredient.type})
              </span>
              <button
                onClick={() => removeIngredient(ingredient.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}