import {
  Clock,
  Users,
  ChefHat,
  Leaf,
  Flame,
  Droplet,
  Lightbulb,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
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
  // Safe data extraction with fallbacks
  const instructions = Array.isArray(recipe.instructions) 
    ? recipe.instructions 
    : Array.isArray(recipe.steps) 
    ? recipe.steps 
    : [];
  
  const cookTime = recipe.cookTime || recipe.cookingTime || "";
  const title = recipe.title || "Untitled Recipe";
  const description = recipe.description || "";
  const prepTime = recipe.prepTime || "N/A";
  const servings = recipe.servings || 1;
  const difficulty = recipe.difficulty || "";
  
  // Safely get ingredients array
  const ingredients = Array.isArray(recipe.ingredients) 
    ? recipe.ingredients.filter(ing => ing && typeof ing === 'string' && ing.trim().length > 0)
    : [];

  // Get ingredient icon based on ingredient type
  const getIngredientIcon = (ingredient: string) => {
    if (!ingredient || typeof ingredient !== 'string') return "🥘";
    
    const lowerIng = ingredient.toLowerCase();
    if (
      lowerIng.includes("meat") ||
      lowerIng.includes("chicken") ||
      lowerIng.includes("beef") ||
      lowerIng.includes("pork") ||
      lowerIng.includes("fish") ||
      lowerIng.includes("shrimp")
    ) {
      return "🍗";
    }
    if (
      lowerIng.includes("vegetable") ||
      lowerIng.includes("carrot") ||
      lowerIng.includes("onion") ||
      lowerIng.includes("tomato") ||
      lowerIng.includes("lettuce") ||
      lowerIng.includes("spinach")
    ) {
      return "🥬";
    }
    if (
      lowerIng.includes("oil") ||
      lowerIng.includes("butter") ||
      lowerIng.includes("cream")
    ) {
      return "🧈";
    }
    if (
      lowerIng.includes("egg") ||
      lowerIng.includes("milk") ||
      lowerIng.includes("cheese")
    ) {
      return "🥚";
    }
    if (
      lowerIng.includes("spice") ||
      lowerIng.includes("salt") ||
      lowerIng.includes("pepper") ||
      lowerIng.includes("sauce") ||
      lowerIng.includes("soy")
    ) {
      return "🧂";
    }
    return "🥘";
  };

  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-card/50 bg-white">
      <CardHeader className="bg-gradient-to-br from-orange-50/80 via-amber-50/80 to-orange-100/60 dark:from-orange-950/30 dark:via-amber-950/30 dark:to-orange-900/20 pb-6 sm:pb-7 md:pb-8 pt-6 sm:pt-7 md:pt-8 border-b border-orange-100/50 dark:border-orange-900/30">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-5">
          <div className="flex-1 min-w-0">
            <CardTitle className="mb-3 sm:mb-3.5 tracking-tight text-2xl sm:text-3xl font-bold break-words text-foreground">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="leading-relaxed text-sm sm:text-base text-muted-foreground mt-2">
                {description}
              </CardDescription>
            )}
          </div>
          {difficulty && (
            <Badge
              variant="secondary"
              className="shrink-0 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-orange-800"
            >
              {difficulty}
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-4 sm:gap-5 md:gap-6 mt-5 sm:mt-6">
          <div className="flex items-center gap-2.5 text-muted-foreground text-sm sm:text-base font-medium">
            <Clock className="w-5 h-5 flex-shrink-0 text-orange-600 dark:text-orange-400" strokeWidth={2.5} />
            <span className="line-clamp-1">Prep: {prepTime}</span>
          </div>
          {cookTime && (
            <div className="flex items-center gap-2.5 text-muted-foreground text-sm sm:text-base font-medium">
              <ChefHat className="w-5 h-5 flex-shrink-0 text-orange-600 dark:text-orange-400" strokeWidth={2.5} />
              <span className="line-clamp-1">Cook: {cookTime}</span>
            </div>
          )}
          <div className="flex items-center gap-2.5 text-muted-foreground text-sm sm:text-base font-medium">
            <Users className="w-5 h-5 flex-shrink-0 text-orange-600 dark:text-orange-400" strokeWidth={2.5} />
            <span className="line-clamp-1">{servings} {servings === 1 ? 'serving' : 'servings'}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 sm:pt-7 md:pt-8 pb-6 sm:pb-7 md:pb-8 space-y-6 sm:space-y-7 md:space-y-8">
        {ingredients.length > 0 ? (
          <div>
            <h3 className="mb-4 sm:mb-5 tracking-tight font-bold text-base sm:text-lg flex items-center gap-2.5 text-foreground">
              <Leaf
                className="w-5 h-5 text-green-600 dark:text-green-400"
                strokeWidth={2.5}
              />
              Ingredients
            </h3>
            <ul className="space-y-3 sm:space-y-3.5">
              {ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 sm:gap-4 text-sm sm:text-base bg-orange-50/50 dark:bg-orange-950/20 p-3 rounded-lg border border-orange-100 dark:border-orange-900/50"
                >
                  <span className="text-xl sm:text-2xl mt-0.5 flex-shrink-0">
                    {getIngredientIcon(ingredient)}
                  </span>
                  <span className="leading-relaxed text-foreground flex-1">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">No ingredients listed for this recipe.</p>
          </div>
        )}

        {instructions.length > 0 ? (
          <>
            <Separator className="my-2" />
            <div>
              <h3 className="mb-4 sm:mb-5 tracking-tight font-bold text-base sm:text-lg flex items-center gap-2.5 text-foreground">
                <Flame
                  className="w-5 h-5 text-orange-600 dark:text-orange-400"
                  strokeWidth={2.5}
                />
                Instructions
              </h3>
              <ol className="space-y-4 sm:space-y-5">
                {instructions.map((step, index) => {
                  const stepText = typeof step === 'string' ? step : String(step || '');
                  if (!stepText.trim()) return null;
                  
                  return (
                    <li
                      key={index}
                      className="flex gap-3 sm:gap-4 text-sm sm:text-base"
                    >
                      <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white text-sm sm:text-base shrink-0 shadow-md font-bold">
                        {index + 1}
                      </span>
                      <span className="flex-1 pt-1 sm:pt-1.5 leading-relaxed text-foreground bg-orange-50/50 dark:bg-orange-950/20 p-3 rounded-lg border border-orange-100 dark:border-orange-900/50">
                        {stepText}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </>
        ) : (
          <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">No instructions available for this recipe.</p>
          </div>
        )}

        {recipe.variations && Array.isArray(recipe.variations) && recipe.variations.length > 0 && (
          <>
            <Separator className="my-2" />
            <div>
              <h3 className="mb-4 sm:mb-5 tracking-tight font-bold text-base sm:text-lg flex items-center gap-2.5 text-foreground">
                <Lightbulb
                  className="w-5 h-5 text-amber-600 dark:text-amber-400"
                  strokeWidth={2.5}
                />
                Variations & Alternatives
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {recipe.variations
                  .filter(v => v && typeof v === 'string' && v.trim().length > 0)
                  .map((variation, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-sm sm:text-base"
                    >
                      <span className="text-2xl mt-0.5 flex-shrink-0">
                        💡
                      </span>
                      <span className="leading-relaxed text-amber-900 dark:text-amber-200">{variation}</span>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}

        {(recipe.nutritionTips || (recipe.healthTips && Array.isArray(recipe.healthTips) && recipe.healthTips.length > 0)) && (
          <>
            <Separator className="my-2" />
            <div className="p-4 sm:p-5 md:p-6 rounded-xl bg-green-50/80 dark:bg-green-950/30 border border-green-200 dark:border-green-900 text-sm sm:text-base">
              <h3 className="mb-3 sm:mb-4 text-green-900 dark:text-green-400 tracking-tight font-bold text-base sm:text-lg flex items-center gap-2.5">
                <Leaf className="w-5 h-5" strokeWidth={2.5} />
                {recipe.healthTips && Array.isArray(recipe.healthTips) && recipe.healthTips.length > 0 ? "Health Tips" : "Nutrition Tip"}
              </h3>
              {recipe.nutritionTips && typeof recipe.nutritionTips === 'string' && (
                <p className="text-green-800 dark:text-green-300 leading-relaxed mb-3">
                  {recipe.nutritionTips}
                </p>
              )}
              {recipe.healthTips && Array.isArray(recipe.healthTips) && recipe.healthTips.length > 0 && (
                <ul className="space-y-2 sm:space-y-2.5 mt-3">
                  {recipe.healthTips
                    .filter(tip => tip && typeof tip === 'string' && tip.trim().length > 0)
                    .map((tip, index) => (
                      <li
                        key={index}
                        className="text-green-800 dark:text-green-300 leading-relaxed flex items-start gap-2"
                      >
                        <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </>
        )}

        {(recipe.calories || recipe.protein || recipe.carbs || recipe.fat) && (
          <>
            <Separator className="my-2" />
            <div className="p-4 sm:p-5 md:p-6 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-sm sm:text-base">
              <h3 className="mb-4 sm:mb-5 text-blue-900 dark:text-blue-400 tracking-tight font-bold text-base sm:text-lg flex items-center gap-2.5">
                <Droplet className="w-5 h-5" strokeWidth={2.5} />
                Nutrition (per serving)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {recipe.calories && (
                  <div className="bg-white dark:bg-gray-900/50 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                    <div className="font-semibold text-blue-700 dark:text-blue-300 text-xs mb-1">
                      Calories
                    </div>
                    <div className="text-blue-600 dark:text-blue-400 font-bold text-base">
                      {typeof recipe.calories === 'number' ? `${recipe.calories} kcal` : recipe.calories}
                    </div>
                  </div>
                )}
                {recipe.protein && typeof recipe.protein === 'string' && (
                  <div className="bg-white dark:bg-gray-900/50 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                    <div className="font-semibold text-blue-700 dark:text-blue-300 text-xs mb-1">
                      Protein
                    </div>
                    <div className="text-blue-600 dark:text-blue-400 font-bold text-base">
                      {recipe.protein}
                    </div>
                  </div>
                )}
                {recipe.carbs && typeof recipe.carbs === 'string' && (
                  <div className="bg-white dark:bg-gray-900/50 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                    <div className="font-semibold text-blue-700 dark:text-blue-300 text-xs mb-1">
                      Carbs
                    </div>
                    <div className="text-blue-600 dark:text-blue-400 font-bold text-base">
                      {recipe.carbs}
                    </div>
                  </div>
                )}
                {recipe.fat && typeof recipe.fat === 'string' && (
                  <div className="bg-white dark:bg-gray-900/50 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                    <div className="font-semibold text-blue-700 dark:text-blue-300 text-xs mb-1">
                      Fat
                    </div>
                    <div className="text-blue-600 dark:text-blue-400 font-bold text-base">
                      {recipe.fat}
                    </div>
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
