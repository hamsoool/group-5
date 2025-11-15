import { Clock, Users, ChefHat } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

interface RecipeCardProps {
  recipe: {
    title: string;
    description?: string;
    prepTime: string;
    cookTime?: string;
    cookingTime?: string;
    servings: number;
    difficulty?: string;
    ingredients: string[];
    steps?: string[];
    instructions?: string[];
    variations?: string[];
    nutritionTips?: string;
    healthTips?: string[];
    calories?: number;
    protein?: string;
    carbs?: string;
    fat?: string;
  };
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const instructions = recipe.instructions || recipe.steps || [];
  const cookTime = recipe.cookTime || recipe.cookingTime || "";

  return (
    <Card className="overflow-hidden border-none shadow-md dark:bg-card/50">
      <CardHeader className="bg-gradient-to-br from-orange-50/80 to-amber-50/80 dark:from-orange-950/30 dark:to-amber-950/30 pb-7 pt-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="mb-2.5 tracking-tight">{recipe.title}</CardTitle>
            {recipe.description && (
              <CardDescription className="leading-relaxed">{recipe.description}</CardDescription>
            )}
          </div>
          {recipe.difficulty && (
            <Badge variant="secondary" className="shrink-0 px-3 py-1">
              {recipe.difficulty}
            </Badge>
          )}
        </div>
        
        <div className="flex flex-wrap gap-5 mt-5">
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <Clock className="w-4 h-4" strokeWidth={2} />
            <span className="text-sm">Prep: {recipe.prepTime}</span>
          </div>
          {cookTime && (
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <ChefHat className="w-4 h-4" strokeWidth={2} />
              <span className="text-sm">Cook: {cookTime}</span>
            </div>
          )}
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <Users className="w-4 h-4" strokeWidth={2} />
            <span className="text-sm">{recipe.servings} servings</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-7 pb-7 space-y-7">
        <div>
          <h3 className="mb-4 tracking-tight">Ingredients</h3>
          <ul className="space-y-2.5">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-orange-500 mt-1 text-lg">•</span>
                <span className="leading-relaxed">{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        {instructions.length > 0 && (
          <>
            <Separator className="my-2" />
            <div>
              <h3 className="mb-4 tracking-tight">Instructions</h3>
              <ol className="space-y-4">
                {instructions.map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-orange-500 text-white text-sm shrink-0 shadow-sm">
                      {index + 1}
                    </span>
                    <span className="flex-1 pt-1 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </>
        )}

        {recipe.variations && recipe.variations.length > 0 && (
          <>
            <Separator className="my-2" />
            <div>
              <h3 className="mb-4 tracking-tight">Variations & Alternatives</h3>
              <div className="space-y-3">
                {recipe.variations.map((variation, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900">
                    <span className="text-amber-600 dark:text-amber-500 mt-0.5 text-lg">💡</span>
                    <span className="leading-relaxed">{variation}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {(recipe.nutritionTips || recipe.healthTips) && (
          <>
            <Separator className="my-2" />
            <div className="p-5 rounded-xl bg-green-50/80 dark:bg-green-950/30 border border-green-100 dark:border-green-900">
              <h3 className="mb-2.5 text-green-900 dark:text-green-400 tracking-tight">
                {recipe.healthTips ? "Health Tips" : "Nutrition Tip"}
              </h3>
              {recipe.nutritionTips && (
                <p className="text-green-800 dark:text-green-300 leading-relaxed">{recipe.nutritionTips}</p>
              )}
              {recipe.healthTips && recipe.healthTips.length > 0 && (
                <ul className="space-y-1.5 mt-2">
                  {recipe.healthTips.map((tip, index) => (
                    <li key={index} className="text-green-800 dark:text-green-300 leading-relaxed">• {tip}</li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        {recipe.calories && (
          <>
            <Separator className="my-2" />
            <div className="p-5 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">
              <h3 className="mb-2.5 text-blue-900 dark:text-blue-400 tracking-tight">Nutrition (per serving)</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-blue-700 dark:text-blue-300">Calories:</span>{' '}
                  <span className="text-blue-600 dark:text-blue-400">{recipe.calories} kcal</span>
                </div>
                {recipe.protein && (
                  <div>
                    <span className="font-medium text-blue-700 dark:text-blue-300">Protein:</span>{' '}
                    <span className="text-blue-600 dark:text-blue-400">{recipe.protein}</span>
                  </div>
                )}
                {recipe.carbs && (
                  <div>
                    <span className="font-medium text-blue-700 dark:text-blue-300">Carbs:</span>{' '}
                    <span className="text-blue-600 dark:text-blue-400">{recipe.carbs}</span>
                  </div>
                )}
                {recipe.fat && (
                  <div>
                    <span className="font-medium text-blue-700 dark:text-blue-300">Fat:</span>{' '}
                    <span className="text-blue-600 dark:text-blue-400">{recipe.fat}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

