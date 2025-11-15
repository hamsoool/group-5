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
  const instructions = recipe.instructions || recipe.steps || [];
  const cookTime = recipe.cookTime || recipe.cookingTime || "";

  // Get ingredient icon based on ingredient type
  const getIngredientIcon = (ingredient: string) => {
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
    <Card className="overflow-hidden border-none shadow-md dark:bg-card/50">
      <CardHeader className="bg-gradient-to-br from-orange-50/80 to-amber-50/80 dark:from-orange-950/30 dark:to-amber-950/30 pb-5 sm:pb-6 md:pb-7 pt-5 sm:pt-6 md:pt-7">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="mb-2 sm:mb-2.5 tracking-tight text-xl sm:text-2xl break-words">
              {recipe.title}
            </CardTitle>
            {recipe.description && (
              <CardDescription className="leading-relaxed text-xs sm:text-sm">
                {recipe.description}
              </CardDescription>
            )}
          </div>
          {recipe.difficulty && (
            <Badge
              variant="secondary"
              className="shrink-0 px-2 sm:px-3 py-1 text-xs sm:text-sm"
            >
              {recipe.difficulty}
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-5 mt-4 sm:mt-5">
          <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
            <Clock className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
            <span className="line-clamp-1">Prep: {recipe.prepTime}</span>
          </div>
          {cookTime && (
            <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
              <ChefHat className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
              <span className="line-clamp-1">Cook: {cookTime}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
            <Users className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
            <span className="line-clamp-1">{recipe.servings} servings</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-5 sm:pt-6 md:pt-7 pb-5 sm:pb-6 md:pb-7 space-y-5 sm:space-y-6 md:space-y-7">
        <div>
          <h3 className="mb-3 sm:mb-4 tracking-tight font-semibold text-sm sm:text-base flex items-center gap-2">
            <Leaf
              className="w-4 h-4 text-green-600 dark:text-green-400"
              strokeWidth={2}
            />
            Ingredients
          </h3>
          <ul className="space-y-2 sm:space-y-2.5">
            {recipe.ingredients.map((ingredient, index) => (
              <li
                key={index}
                className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm"
              >
                <span className="text-lg sm:text-xl mt-0.5 flex-shrink-0">
                  {getIngredientIcon(ingredient)}
                </span>
                <span className="leading-relaxed">{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        {instructions.length > 0 && (
          <>
            <Separator className="my-2" />
            <div>
              <h3 className="mb-3 sm:mb-4 tracking-tight font-semibold text-sm sm:text-base flex items-center gap-2">
                <Flame
                  className="w-4 h-4 text-orange-600 dark:text-orange-400"
                  strokeWidth={2}
                />
                Instructions
              </h3>
              <ol className="space-y-3 sm:space-y-4">
                {instructions.map((step, index) => (
                  <li
                    key={index}
                    className="flex gap-2 sm:gap-4 text-xs sm:text-sm"
                  >
                    <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-orange-500 text-white text-xs sm:text-sm shrink-0 shadow-sm font-semibold">
                      {index + 1}
                    </span>
                    <span className="flex-1 pt-0.5 sm:pt-1 leading-relaxed">
                      {step}
                    </span>
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
              <h3 className="mb-3 sm:mb-4 tracking-tight font-semibold text-sm sm:text-base flex items-center gap-2">
                <Lightbulb
                  className="w-4 h-4 text-amber-600 dark:text-amber-400"
                  strokeWidth={2}
                />
                Variations & Alternatives
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {recipe.variations.map((variation, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 text-xs sm:text-sm"
                  >
                    <span className="text-lg sm:text-xl mt-0.5 flex-shrink-0">
                      💡
                    </span>
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
            <div className="p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl bg-green-50/80 dark:bg-green-950/30 border border-green-100 dark:border-green-900 text-xs sm:text-sm">
              <h3 className="mb-2 sm:mb-2.5 text-green-900 dark:text-green-400 tracking-tight font-semibold flex items-center gap-2">
                <Leaf className="w-4 h-4" strokeWidth={2} />
                {recipe.healthTips ? "Health Tips" : "Nutrition Tip"}
              </h3>
              {recipe.nutritionTips && (
                <p className="text-green-800 dark:text-green-300 leading-relaxed">
                  {recipe.nutritionTips}
                </p>
              )}
              {recipe.healthTips && recipe.healthTips.length > 0 && (
                <ul className="space-y-1 sm:space-y-1.5 mt-2">
                  {recipe.healthTips.map((tip, index) => (
                    <li
                      key={index}
                      className="text-green-800 dark:text-green-300 leading-relaxed"
                    >
                      • {tip}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        {recipe.calories && (
          <>
            <Separator className="my-2" />
            <div className="p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 text-xs sm:text-sm">
              <h3 className="mb-2 sm:mb-2.5 text-blue-900 dark:text-blue-400 tracking-tight font-semibold flex items-center gap-2">
                <Droplet className="w-4 h-4" strokeWidth={2} />
                Nutrition (per serving)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs sm:text-sm">
                <div>
                  <span className="font-medium text-blue-700 dark:text-blue-300">
                    Calories:
                  </span>{" "}
                  <span className="text-blue-600 dark:text-blue-400 block sm:inline">
                    {recipe.calories} kcal
                  </span>
                </div>
                {recipe.protein && (
                  <div>
                    <span className="font-medium text-blue-700 dark:text-blue-300">
                      Protein:
                    </span>{" "}
                    <span className="text-blue-600 dark:text-blue-400 block sm:inline">
                      {recipe.protein}
                    </span>
                  </div>
                )}
                {recipe.carbs && (
                  <div>
                    <span className="font-medium text-blue-700 dark:text-blue-300">
                      Carbs:
                    </span>{" "}
                    <span className="text-blue-600 dark:text-blue-400 block sm:inline">
                      {recipe.carbs}
                    </span>
                  </div>
                )}
                {recipe.fat && (
                  <div>
                    <span className="font-medium text-blue-700 dark:text-blue-300">
                      Fat:
                    </span>{" "}
                    <span className="text-blue-600 dark:text-blue-400">
                      {recipe.fat}
                    </span>
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
