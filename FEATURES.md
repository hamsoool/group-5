# CookBot - Feature Documentation

## Recently Integrated Features

### 1. Recipe Customization ✅
**Description:** Users can adjust AI-generated recipes based on dietary preferences.

**Features:**
- ✅ Vegetarian filter (no meat or fish)
- ✅ Low-salt option (minimal sodium)
- ✅ Budget-friendly option (affordable ingredients)
- ✅ Checkbox toggles for easy selection
- ✅ API dynamically adjusts prompts based on preferences

**Location:** 
- UI: `app/components/RecipeGenerator.tsx` (Recipe Preferences section)
- API: `app/api/generate-recipe/route.ts` (customization logic)

**Usage:**
1. Check desired options before generating recipes
2. Click "Generate 3 Recipes"
3. All recipes will match your preferences

---

### 2. Nutrition & Health Tips ✅
**Description:** Provides health-related suggestions and nutritional insights for generated recipes.

**Features:**
- ✅ Calorie count per serving
- ✅ Macronutrients (Protein, Carbs, Fat)
- ✅ Health tips for each recipe (2-3 tips)
- ✅ Toggle button to show/hide health tips
- ✅ Color-coded nutrition display (green theme)
- ✅ Visible in both generated recipes and saved recipe modal

**Location:**
- UI: `app/components/RecipeGenerator.tsx` (Nutrition & Health Tips sections)
- Modal: `app/dashboard/page.tsx` (Recipe detail modal)
- API: `app/api/generate-recipe/route.ts` (nutrition data generation)

**Data Structure:**
```typescript
{
  calories: number,        // e.g., 450
  protein: "25g",
  carbs: "50g",
  fat: "15g",
  healthTips: [
    "Rich in protein for muscle building",
    "Contains vitamin C from vegetables",
    "Low in saturated fats"
  ]
}
```

---

### 3. Enhanced Cooking Instructions ✅
**Description:** Improved recipe instruction display with better readability and additional actions.

**Features:**
- ✅ Numbered step circles for visual clarity
- ✅ Step-by-step formatting with proper spacing
- ✅ Print button (opens print-friendly window)
- ✅ Copy button (copies recipe to clipboard)
- ✅ Prep time and cooking time display
- ✅ Handles missing instruction cases gracefully
- ✅ Improved typography and layout

**Location:**
- UI: `app/components/RecipeGenerator.tsx` (Instructions & Action Buttons)
- Modal: `app/dashboard/page.tsx` (Recipe detail modal instructions)

**Action Buttons:**
- 🖨️ **Print:** Opens a new window with print-friendly format
- 📋 **Copy:** Copies full recipe text to clipboard

---

## Technical Details

### Updated Recipe Interface
```typescript
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
  calories?: number;          // NEW
  protein?: string;            // NEW
  carbs?: string;              // NEW
  fat?: string;                // NEW
  healthTips?: string[];       // NEW
}
```

### API Customization Parameters
```typescript
{
  ingredients: Ingredient[],
  customization: {
    vegetarian: boolean,
    lowSalt: boolean,
    budgetFriendly: boolean
  }
}
```

### Firebase Storage
All new fields are automatically saved to Firestore when recipes are saved:
- Nutrition information
- Health tips
- All metadata

---

## User Flow

1. **Add Ingredients** (2 maximum)
   - Enter ingredient name, quantity, unit, type
   
2. **Select Preferences** (Optional)
   - Check vegetarian, low-salt, or budget-friendly options
   
3. **Generate Recipes**
   - Click "Generate 3 Recipes"
   - AI creates 3 common Filipino dishes with nutrition info
   
4. **View Recipe Details**
   - See ingredients, instructions, nutrition, and health tips
   - Toggle health tips visibility
   
5. **Take Actions**
   - Print recipe for physical copy
   - Copy recipe text to clipboard
   - Save recipe to Firestore
   
6. **Access Saved Recipes**
   - View in "Saved Recipes" section
   - Click to see full details in modal with nutrition info

---

## Future Enhancements (Optional)

- [ ] Share recipe via email/social media
- [ ] Meal planning calendar
- [ ] Ingredient substitution suggestions
- [ ] Shopping list generator
- [ ] Recipe ratings and reviews
- [ ] Video cooking tutorials integration
- [ ] Voice-guided cooking mode

---

## Notes

- All features are fully integrated and tested
- No TypeScript errors
- Compatible with Firebase Authentication and Firestore
- Responsive design for mobile and desktop
- Dark mode support for all new features
- Filipino cuisine focus maintained across all recipes
