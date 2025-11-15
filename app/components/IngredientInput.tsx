import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface IngredientInputProps {
  ingredients: string[];
  onIngredientsChange: (ingredients: string[]) => void;
}

export function IngredientInput({ ingredients, onIngredientsChange }: IngredientInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAddIngredient = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      onIngredientsChange([...ingredients, trimmed]);
      setInputValue("");
    }
  };

  const handleRemoveIngredient = (ingredientToRemove: string) => {
    onIngredientsChange(ingredients.filter(ing => ing !== ingredientToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2.5">
        <Input
          type="text"
          placeholder="Enter an ingredient (e.g., chicken, rice, tomatoes)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 shadow-sm"
        />
        <Button onClick={handleAddIngredient} size="icon" className="shrink-0 shadow-sm">
          <Plus className="w-4 h-4" strokeWidth={2} />
        </Button>
      </div>

      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2.5">
          {ingredients.map((ingredient, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="px-3.5 py-2 cursor-pointer hover:bg-secondary/80 transition-colors shadow-sm"
            >
              <span className="tracking-wide">{ingredient}</span>
              <button
                onClick={() => handleRemoveIngredient(ingredient)}
                className="ml-2.5 hover:text-destructive transition-colors"
                aria-label={`Remove ${ingredient}`}
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

