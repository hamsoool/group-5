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

  useEffect(() => {
    onIngredientsChange(ingredients);
  }, [ingredients, onIngredientsChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Ingredient name"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
          value={newIngredient.name}
          onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
        />
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Amount"
            className="w-24 rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
            value={newIngredient.quantity || ''}
            onChange={(e) => setNewIngredient({ ...newIngredient, quantity: parseFloat(e.target.value) })}
          />
          <select
            className="rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
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
            className="rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
            value={newIngredient.type}
            onChange={(e) => setNewIngredient({ ...newIngredient, type: e.target.value as Ingredient['type'] })}
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
        className="w-full rounded-md bg-black py-2 text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        Add Ingredient
      </button>

      <ul className="max-h-64 space-y-2 overflow-y-auto">
        {ingredients.map((ingredient) => (
          <li
            key={ingredient.id}
            className="flex justify-between rounded-md border border-zinc-200 p-2 dark:border-zinc-800"
          >
            <span>{ingredient.name}</span>
            <span className="text-zinc-500">
              {ingredient.quantity} {ingredient.unit} ({ingredient.type})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}