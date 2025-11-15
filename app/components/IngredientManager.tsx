'use client';

import { useEffect, useState, useRef } from 'react';
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

// Common ingredients list for autocomplete
const COMMON_INGREDIENTS = [
  // Meats
  'chicken', 'pork', 'beef', 'ground pork', 'ground beef', 'chicken breast', 'chicken thigh',
  'pork belly', 'pork ribs', 'oxtail', 'ham', 'bacon', 'sausage', 'hotdog',
  // Vegetables
  'onion', 'garlic', 'tomato', 'potato', 'carrot', 'cabbage', 'eggplant', 'string beans',
  'green beans', 'kangkong', 'water spinach', 'spinach', 'lettuce', 'bell pepper',
  'chili', 'green chili', 'red chili', 'ginger', 'radish', 'banana heart',
  // Fish & Seafood
  'fish', 'tilapia', 'bangus', 'shrimp', 'prawn', 'squid', 'crab', 'mussels',
  // Grains & Staples
  'rice', 'pancit canton', 'egg noodles', 'bihon', 'spaghetti noodles',
  // Dairy & Others
  'egg', 'milk', 'cream', 'cheese', 'butter', 'oil', 'cooking oil',
  // Condiments & Seasonings
  'soy sauce', 'vinegar', 'fish sauce', 'oyster sauce', 'tomato sauce', 'peanut butter',
  'sinigang mix', 'annatto seeds', 'bay leaves', 'black pepper', 'salt', 'sugar',
  // Others
  'tofu', 'mushroom', 'corn', 'green peas', 'bell pepper', 'celery'
];

interface IngredientManagerProps {
  ingredients?: Ingredient[];
  onIngredientsChange: (ingredients: Ingredient[]) => void;
}

export default function IngredientManager({ ingredients: propIngredients = [], onIngredientsChange }: IngredientManagerProps) {
  // Use propIngredients directly as the source of truth (controlled component)
  const ingredients = propIngredients;
  
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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const quantityInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const MIN_INGREDIENTS = 3;

  // Auto-detect ingredient type based on name
  const detectIngredientType = (name: string): IngredientType => {
    const lowerName = name.toLowerCase();
    if (['chicken', 'pork', 'beef', 'ham', 'bacon', 'sausage', 'hotdog', 'oxtail'].some(meat => lowerName.includes(meat))) {
      return 'meat';
    }
    if (['fish', 'shrimp', 'prawn', 'squid', 'crab', 'mussels', 'tilapia', 'bangus'].some(fish => lowerName.includes(fish))) {
      return 'fish';
    }
    if (['onion', 'garlic', 'tomato', 'potato', 'carrot', 'cabbage', 'eggplant', 'chili', 'kangkong', 'spinach', 'lettuce', 'bell pepper', 'ginger', 'radish', 'banana heart', 'mushroom', 'corn', 'green peas', 'celery'].some(veg => lowerName.includes(veg))) {
      return 'vegetable';
    }
    return 'other';
  };

  // Smart defaults for unit and quantity based on ingredient name
  const getSmartDefaults = (name: string): { unit: string; quantity: number } => {
    const lowerName = name.toLowerCase();
    
    // Ingredients that use "piece" as unit
    if (['egg', 'hotdog', 'sausage', 'bay leaves', 'chili', 'green chili', 'red chili'].some(ing => lowerName.includes(ing))) {
      return { unit: 'piece', quantity: 1 };
    }
    
    // Ingredients that use "kg" (typically larger quantities)
    if (['chicken', 'pork', 'beef', 'pork belly', 'pork ribs', 'oxtail', 'fish', 'tilapia', 'bangus'].some(ing => lowerName.includes(ing))) {
      return { unit: 'kg', quantity: 0.5 };
    }
    
    // Ingredients that use "cup" (cooking measurements)
    if (['rice', 'milk', 'cream', 'flour'].some(ing => lowerName.includes(ing))) {
      return { unit: 'cup', quantity: 1 };
    }
    
    // Ingredients that use "tbsp" (condiments/sauces)
    if (['soy sauce', 'vinegar', 'fish sauce', 'oyster sauce', 'tomato sauce', 'peanut butter', 'oil', 'cooking oil', 'butter'].some(ing => lowerName.includes(ing))) {
      return { unit: 'tbsp', quantity: 1 };
    }
    
    // Ingredients that use "tsp" (spices/seasonings)
    if (['salt', 'sugar', 'black pepper', 'sinigang mix'].some(ing => lowerName.includes(ing))) {
      return { unit: 'tsp', quantity: 1 };
    }
    
    // Ingredients that use "ml" or "L" (liquids)
    if (['water', 'broth', 'stock'].some(ing => lowerName.includes(ing))) {
      return { unit: 'ml', quantity: 250 };
    }
    
    // Default for vegetables and other ingredients (use grams)
    return { unit: 'g', quantity: 100 };
  };

  // Filter suggestions based on input
  const handleInputChange = (value: string) => {
    setNewIngredient({ ...newIngredient, name: value });
    
    if (value.length > 0) {
      const filtered = COMMON_INGREDIENTS.filter(ing => 
        ing.toLowerCase().startsWith(value.toLowerCase()) &&
        !ingredients.some(existing => existing.name.toLowerCase() === ing.toLowerCase())
      ).slice(0, 8); // Limit to 8 suggestions
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedSuggestionIndex(-1);
      
      // Auto-apply smart defaults if the typed value exactly matches a common ingredient
      const exactMatch = COMMON_INGREDIENTS.find(ing => ing.toLowerCase() === value.toLowerCase().trim());
      if (exactMatch && !ingredients.some(existing => existing.name.toLowerCase() === exactMatch.toLowerCase())) {
        const smartDefaults = getSmartDefaults(exactMatch);
        const detectedType = detectIngredientType(exactMatch);
        // Only update if current values are default/empty
        if (newIngredient.quantity === 0 && newIngredient.unit === 'g' && newIngredient.type === 'other') {
          setNewIngredient(prev => ({
            ...prev,
            name: value,
            unit: smartDefaults.unit,
            quantity: smartDefaults.quantity,
            type: detectedType
          }));
        }
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const selectSuggestion = (suggestion: string) => {
    const detectedType = detectIngredientType(suggestion);
    const smartDefaults = getSmartDefaults(suggestion);
    
    setNewIngredient({ 
      ...newIngredient, 
      name: suggestion, 
      type: detectedType,
      unit: smartDefaults.unit,
      quantity: smartDefaults.quantity
    });
    setShowSuggestions(false);
    setSuggestions([]);
    
    // Auto-focus quantity input after a short delay
    setTimeout(() => {
      quantityInputRef.current?.focus();
      quantityInputRef.current?.select();
    }, 100);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
      } else if (e.key === 'Enter' && selectedSuggestionIndex >= 0) {
        e.preventDefault();
        selectSuggestion(suggestions[selectedSuggestionIndex]);
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    } else if (e.key === 'Enter' && newIngredient.name && !showSuggestions) {
      // If Enter is pressed with a name but no suggestions, apply smart defaults if not set
      const exactMatch = COMMON_INGREDIENTS.find(ing => ing.toLowerCase() === newIngredient.name.toLowerCase().trim());
      if (exactMatch && (newIngredient.quantity === 0 || newIngredient.unit === 'g')) {
        const smartDefaults = getSmartDefaults(exactMatch);
        const detectedType = detectIngredientType(exactMatch);
        setNewIngredient(prev => ({
          ...prev,
          name: exactMatch,
          unit: smartDefaults.unit,
          quantity: smartDefaults.quantity,
          type: detectedType
        }));
        // Focus quantity field
        setTimeout(() => {
          quantityInputRef.current?.focus();
          quantityInputRef.current?.select();
        }, 100);
      }
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addIngredient = () => {
    if (newIngredient.name && newIngredient.quantity) {
      const trimmedName = newIngredient.name.trim();
      // Check if ingredient already exists
      if (ingredients.some(ing => ing.name.toLowerCase() === trimmedName.toLowerCase())) {
        alert(`${trimmedName} is already added!`);
        return;
      }
      
      const detectedType = detectIngredientType(trimmedName);
      const newIngredientItem: Ingredient = {
        id: Date.now().toString(), 
        ...newIngredient, 
        name: trimmedName,
        type: detectedType
      };
      
      // Update parent component directly
      onIngredientsChange([...ingredients, newIngredientItem]);
      
      setNewIngredient({
        name: '',
        quantity: 0,
        unit: 'g',
        type: 'other'
      });
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const removeIngredient = (id: string) => {
    // Update parent component directly
    onIngredientsChange(ingredients.filter(ing => ing.id !== id));
  };

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
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Type ingredient name (e.g., chicken, onion, rice...)"
            value={newIngredient.name}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            className="shadow-sm"
            autoComplete="off"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute z-50 w-full mt-1 bg-white dark:bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => selectSuggestion(suggestion)}
                  className={`w-full text-left px-4 py-2 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors ${
                    index === selectedSuggestionIndex ? 'bg-orange-100 dark:bg-orange-900/40' : ''
                  } ${index === 0 ? 'rounded-t-md' : ''} ${index === suggestions.length - 1 ? 'rounded-b-md' : ''}`}
                >
                  <span className="text-sm font-medium">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Quantity and Unit Input */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                ref={quantityInputRef}
                type="number"
                placeholder="Amount"
                className="w-full shadow-sm"
                value={newIngredient.quantity || ''}
                onChange={(e) => setNewIngredient({ ...newIngredient, quantity: parseFloat(e.target.value) || 0 })}
                step="0.1"
                min="0"
              />
            </div>
            <select
              className="flex h-9 w-32 rounded-md border border-input bg-input-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={newIngredient.unit}
              onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
            >
              {UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
          
          {/* Quick Add Buttons for Common Quantities */}
          {newIngredient.name && (
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground self-center">Quick add:</span>
              {(() => {
                const defaults = getSmartDefaults(newIngredient.name);
                const quickAmounts = defaults.unit === 'piece' 
                  ? [1, 2, 3, 4, 6]
                  : defaults.unit === 'kg'
                  ? [0.5, 1, 1.5, 2]
                  : defaults.unit === 'cup'
                  ? [0.5, 1, 2, 3]
                  : defaults.unit === 'tbsp' || defaults.unit === 'tsp'
                  ? [1, 2, 3, 5]
                  : [50, 100, 200, 500];
                
                return quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setNewIngredient({ ...newIngredient, quantity: amount })}
                    className="px-3 py-1 text-xs rounded-full bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors border border-orange-200 dark:border-orange-800"
                  >
                    {amount} {newIngredient.unit}
                  </button>
                ));
              })()}
            </div>
          )}
          
          {/* Auto-detected Type Display (read-only, less prominent) */}
          {newIngredient.name && (
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <span>Type: <span className="font-medium capitalize">{newIngredient.type}</span></span>
              <span className="text-muted-foreground/50">•</span>
              <span>Auto-detected</span>
            </div>
          )}
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
