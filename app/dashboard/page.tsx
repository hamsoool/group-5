"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { Header } from "@/app/components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Sparkles,
  Lightbulb,
  Leaf,
  LogOut,
  Trash2,
  Home,
  List,
  BookOpen,
  Wand2,
  Heart,
  User,
  CheckCircle2,
  Edit2,
  X,
  Save,
} from "lucide-react";
import IngredientManager from "@/app/components/IngredientManager";
import { RecipeCard } from "@/app/components/RecipeCard";
import { useToast } from "@/app/components/ui/use-toast";
import { ToastContainer } from "@/app/components/ui/toast";

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  type: "meat" | "vegetable" | "fish" | "other";
}

interface Recipe {
  id?: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookingTime?: string;
  servings: number;
  cuisine?: string;
  difficulty?: string;
  calories?: number;
  protein?: string;
  carbs?: string;
  fat?: string;
  healthTips?: string[];
  description?: string;
}

// Suggested Filipino Recipes
const suggestedFilipinoRecipes: Recipe[] = [
  {
    title: "Chicken Adobo",
    description:
      "The Philippines' national dish - tender chicken braised in soy sauce, vinegar, and garlic",
    ingredients: [
      "1 kg chicken, cut into serving pieces",
      "1/2 cup soy sauce",
      "1/2 cup white vinegar",
      "1 head garlic, crushed",
      "1 tsp whole black peppercorns",
      "3 bay leaves",
      "1 cup water",
    ],
    instructions: [
      "Combine chicken, soy sauce, and garlic in a pot. Marinate for at least 30 minutes.",
      "Add water and bring to a boil. Lower heat and simmer for 30 minutes.",
      "Add vinegar and peppercorns. Simmer for another 10 minutes.",
      "Add bay leaves and continue cooking until chicken is tender.",
      "Increase heat to reduce sauce until thick and oily. Serve hot with rice.",
    ],
    prepTime: "15 mins",
    cookingTime: "45 mins",
    servings: 4,
    difficulty: "Easy",
    cuisine: "Filipino",
    calories: 320,
    protein: "35g",
    carbs: "8g",
    fat: "15g",
  },
  {
    title: "Sinigang na Baboy",
    description:
      "Sour and savory pork soup with vegetables, a Filipino comfort food favorite",
    ingredients: [
      "500g pork ribs or belly",
      "1 packet sinigang mix (tamarind soup base)",
      "1 large tomato, quartered",
      "1 medium onion, quartered",
      "2 cups kangkong (water spinach)",
      "1 cup string beans, cut into 2-inch pieces",
      "1 medium radish, sliced",
      "2 pieces green chili",
      "6 cups water",
    ],
    instructions: [
      "Boil pork in water until tender, about 45 minutes.",
      "Add tomato and onion. Simmer for 5 minutes.",
      "Add sinigang mix and stir until dissolved.",
      "Add radish and string beans. Cook for 5 minutes.",
      "Add kangkong and green chili. Simmer for 2 minutes.",
      "Season with salt if needed. Serve hot with rice.",
    ],
    prepTime: "20 mins",
    cookingTime: "60 mins",
    servings: 4,
    difficulty: "Easy",
    cuisine: "Filipino",
    calories: 280,
    protein: "28g",
    carbs: "12g",
    fat: "12g",
  },
  {
    title: "Kare-Kare",
    description:
      "Rich oxtail stew in peanut sauce, traditionally served with bagoong (shrimp paste)",
    ingredients: [
      "1 kg oxtail, cut into serving pieces",
      "1/2 cup peanut butter",
      "1/4 cup ground toasted rice",
      "2 cups string beans, cut into 2-inch pieces",
      "2 cups eggplant, sliced",
      "1 cup banana heart, sliced",
      "1/2 cup annatto seeds (achuete)",
      "6 cups water",
      "Salt to taste",
    ],
    instructions: [
      "Boil oxtail until very tender, about 2-3 hours. Reserve broth.",
      "Soak annatto seeds in hot water to extract color. Strain.",
      "In a pot, heat annatto oil. Add oxtail and sauté.",
      "Add peanut butter and ground rice. Stir well.",
      "Pour in reserved broth. Simmer until thick.",
      "Add vegetables and cook until tender. Season with salt.",
      "Serve with bagoong on the side.",
    ],
    prepTime: "30 mins",
    cookingTime: "180 mins",
    servings: 6,
    difficulty: "Medium",
    cuisine: "Filipino",
    calories: 450,
    protein: "42g",
    carbs: "18g",
    fat: "22g",
  },
  {
    title: "Pancit Canton",
    description:
      "Stir-fried noodles with vegetables and meat, a staple at Filipino celebrations",
    ingredients: [
      "500g pancit canton (egg noodles)",
      "250g pork, sliced",
      "250g chicken, sliced",
      "1 cup shrimp, shelled",
      "2 cups cabbage, shredded",
      "1 cup carrots, julienned",
      "1 cup green beans, sliced",
      "1/2 cup soy sauce",
      "1/4 cup oyster sauce",
      "1 head garlic, minced",
      "1 medium onion, sliced",
    ],
    instructions: [
      "Soak noodles in warm water for 10 minutes. Drain.",
      "Heat oil in a wok. Sauté garlic and onion.",
      "Add pork and chicken. Cook until browned.",
      "Add shrimp and cook until pink.",
      "Add vegetables and stir-fry for 2 minutes.",
      "Add noodles, soy sauce, and oyster sauce.",
      "Toss everything together until well combined. Serve hot.",
    ],
    prepTime: "20 mins",
    cookingTime: "20 mins",
    servings: 6,
    difficulty: "Easy",
    cuisine: "Filipino",
    calories: 380,
    protein: "25g",
    carbs: "45g",
    fat: "12g",
  },
];

export default function DashboardPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [userProfile, setUserProfile] = useState<{
    firstName?: string;
    lastName?: string;
    contactNo?: string;
  } | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState<{
    firstName: string;
    lastName: string;
    contactNo: string;
  }>({
    firstName: "",
    lastName: "",
    contactNo: "",
  });
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);
  const [savedRecipeIds, setSavedRecipeIds] = useState<Set<string>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    recipeId: string | null;
  }>({ show: false, recipeId: null });
  const [showNutrition, setShowNutrition] = useState(true);
  const [showHealthTips, setShowHealthTips] = useState(true);
  const { toasts, success, error, warning, info, removeToast } = useToast();
  const router = useRouter();

  // Filter states
  const [dishType, setDishType] = useState<string>("Lunch");
  const [diet, setDiet] = useState<string>("Vegetarian");
  const [time, setTime] = useState<string>("< 30 min");
  const [goal, setGoal] = useState<string>("Budget");
  const [activeTab, setActiveTab] = useState<
    "home" | "ingredients" | "recipes" | "profile"
  >("home");

  // Save ingredients to Firestore whenever they change (but not during initial load)
  useEffect(() => {
    if (user && !isLoadingIngredients) {
      saveIngredientsToFirestore(user.uid, ingredients);
    }

    // Auto-switch away from Vegetarian/Vegan if meat or fish is added
    const hasMeatOrFish = ingredients.some(
      (ing) => ing.type === "meat" || ing.type === "fish"
    );
    if (hasMeatOrFish && (diet === "Vegetarian" || diet === "Vegan")) {
      setDiet("Keto"); // Switch to a neutral diet option
      warning(
        `Switched from ${diet} to Keto because you added meat or fish`,
        3000
      );
    }
  }, [ingredients, user, isLoadingIngredients, diet]);

  // Check authentication and load recipes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Clear ingredients immediately when switching users
        setIngredients([]);
        setUser(currentUser);
        loadRecipes(currentUser.uid);
        loadUserProfile(currentUser.uid);
        loadUserIngredients(currentUser.uid);
      } else {
        // Clear ingredients when user logs out
        setIngredients([]);
        router.push("/auth/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Listen for ingredient manager events
  useEffect(() => {
    const handleIngredientValidationError = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.message) {
        error(customEvent.detail.message, 4000);
      }
    };

    const handleIngredientAdded = (event: Event) => {
      const customEvent = event as CustomEvent;
      const ingredient = customEvent.detail?.ingredient;
      if (ingredient?.name) {
        success(`Added ${ingredient.name}`, 2000);
      }
    };

    const handleIngredientRemoved = (event: Event) => {
      const customEvent = event as CustomEvent;
      const ingredient = customEvent.detail?.ingredient;
      if (ingredient?.name) {
        info(`Removed ${ingredient.name}`, 2000);
      }
    };

    const handleIngredientError = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.message) {
        error(customEvent.detail.message, 4000);
      }
    };

    window.addEventListener(
      "ingredientValidationError",
      handleIngredientValidationError
    );
    window.addEventListener("ingredientAdded", handleIngredientAdded);
    window.addEventListener("ingredientRemoved", handleIngredientRemoved);
    window.addEventListener("ingredientError", handleIngredientError);

    return () => {
      window.removeEventListener(
        "ingredientValidationError",
        handleIngredientValidationError
      );
      window.removeEventListener("ingredientAdded", handleIngredientAdded);
      window.removeEventListener("ingredientRemoved", handleIngredientRemoved);
      window.removeEventListener("ingredientError", handleIngredientError);
    };
  }, [success, error, info]);

  const loadRecipes = async (userId: string) => {
    try {
      const recipesCollection = collection(db, "recipes");
      const q = query(recipesCollection, where("userId", "==", userId));
      const recipesSnapshot = await getDocs(q);
      const recipesList = recipesSnapshot.docs.map((doc) => {
        const data = doc.data();
        const recipe: Recipe & { createdAt?: string } = {
          id: doc.id,
          title: data.title || "Untitled Recipe",
          ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
          instructions: Array.isArray(data.instructions)
            ? data.instructions
            : [],
          prepTime: data.prepTime || "N/A",
          cookingTime: data.cookingTime || undefined,
          servings:
            typeof data.servings === "number" && data.servings > 0
              ? data.servings
              : 1,
          cuisine: data.cuisine || "Filipino",
          difficulty: data.difficulty || undefined,
          calories:
            typeof data.calories === "number" ? data.calories : undefined,
          protein: data.protein || undefined,
          carbs: data.carbs || undefined,
          fat: data.fat || undefined,
          healthTips: Array.isArray(data.healthTips)
            ? data.healthTips
            : undefined,
          description: data.description || undefined,
        };
        // Preserve createdAt for sorting
        if (data.createdAt) {
          (recipe as any).createdAt = data.createdAt;
        }
        return recipe;
      });

      // Sort by creation date (newest first)
      recipesList.sort((a, b) => {
        const aDate = (a as any).createdAt || "";
        const bDate = (b as any).createdAt || "";
        return bDate.localeCompare(aDate);
      });

      setSavedRecipes(recipesList);

      // Update saved recipe IDs set for duplicate checking
      const savedTitles = new Set<string>(
        recipesList
          .map((r) => r.title?.toLowerCase().trim())
          .filter((title): title is string => Boolean(title))
      );
      setSavedRecipeIds(savedTitles);
    } catch (error) {
      console.error("Error loading recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        console.log("User profile data loaded:", data);
        setUserProfile({
          firstName: data.firstName,
          lastName: data.lastName,
          contactNo: data.contactNo,
        });
      } else {
        console.log("User profile document does not exist for userId:", userId);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  const loadUserIngredients = async (userId: string) => {
    try {
      setIsLoadingIngredients(true);
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        if (
          data.ingredients &&
          Array.isArray(data.ingredients) &&
          data.ingredients.length > 0
        ) {
          setIngredients(data.ingredients);
        } else {
          setIngredients([]);
        }
      } else {
        setIngredients([]);
      }
    } catch (error) {
      console.error("Error loading user ingredients:", error);
      setIngredients([]);
    } finally {
      setIsLoadingIngredients(false);
    }
  };

  const saveIngredientsToFirestore = async (
    userId: string,
    ingredientsToSave: Ingredient[]
  ) => {
    try {
      const userDocRef = doc(db, "users", userId);
      await setDoc(
        userDocRef,
        {
          ingredients: ingredientsToSave,
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving ingredients to Firestore:", error);
    }
  };

  // Profile editing functions
  const handleEditProfile = () => {
    setEditedProfile({
      firstName: userProfile?.firstName || "",
      lastName: userProfile?.lastName || "",
      contactNo: userProfile?.contactNo || "",
    });
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditedProfile({
      firstName: "",
      lastName: "",
      contactNo: "",
    });
  };

  const handleSaveProfile = async () => {
    if (!user) {
      error("You must be logged in to update profile");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        {
          firstName: editedProfile.firstName.trim(),
          lastName: editedProfile.lastName.trim(),
          contactNo: editedProfile.contactNo.trim(),
        },
        { merge: true }
      );

      setUserProfile({
        firstName: editedProfile.firstName.trim(),
        lastName: editedProfile.lastName.trim(),
        contactNo: editedProfile.contactNo.trim(),
      });

      setIsEditingProfile(false);
      success("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      error("Failed to update profile. Please try again.");
    }
  };

  // Helper function to check if recipe is already saved
  const isRecipeSaved = (recipeTitle: string): boolean => {
    const normalizedTitle = recipeTitle?.toLowerCase().trim() || "";
    if (!normalizedTitle) return false;
    return savedRecipeIds.has(normalizedTitle);
  };

  const handleSaveRecipe = async (
    recipe: Omit<Recipe, "id"> & { id?: string }
  ) => {
    if (!user) {
      error("You must be logged in to save recipes");
      return;
    }

    // Check if recipe already exists (by title)
    const recipeTitle = recipe.title?.trim() || "";
    if (!recipeTitle) {
      error("Recipe title is required");
      return;
    }

    // Check for duplicate by title (case-insensitive)
    if (isRecipeSaved(recipeTitle)) {
      warning("This recipe is already saved!");
      return;
    }

    try {
      // Prepare recipe data with all required fields
      const recipeData: any = {
        userId: user.uid,
        title: recipeTitle,
        ingredients: Array.isArray(recipe.ingredients)
          ? recipe.ingredients
          : [],
        instructions: Array.isArray(recipe.instructions)
          ? recipe.instructions
          : [],
        prepTime: recipe.prepTime || "N/A",
        servings:
          typeof recipe.servings === "number" && recipe.servings > 0
            ? recipe.servings
            : 1,
        cuisine: recipe.cuisine || "Filipino",
        createdAt: new Date().toISOString(),
      };

      // Add optional fields only if they exist
      if (recipe.cookingTime) recipeData.cookingTime = recipe.cookingTime;
      if (recipe.difficulty) recipeData.difficulty = recipe.difficulty;
      if (typeof recipe.calories === "number" && recipe.calories > 0)
        recipeData.calories = recipe.calories;
      if (recipe.protein) recipeData.protein = recipe.protein;
      if (recipe.carbs) recipeData.carbs = recipe.carbs;
      if (recipe.fat) recipeData.fat = recipe.fat;
      if (Array.isArray(recipe.healthTips) && recipe.healthTips.length > 0)
        recipeData.healthTips = recipe.healthTips;
      if (recipe.description) recipeData.description = recipe.description;

      console.log("Saving recipe with data:", recipeData);
      console.log("User UID:", user.uid);

      const recipesCollection = collection(db, "recipes");
      const docRef = await addDoc(recipesCollection, recipeData);

      console.log("Recipe saved with ID:", docRef.id);

      // Update saved recipe IDs immediately
      const normalizedTitle = recipeTitle.toLowerCase().trim();
      setSavedRecipeIds((prev) => new Set([...prev, normalizedTitle]));

      // Reload recipes from Firestore to ensure consistency
      await loadRecipes(user.uid);

      success("Recipe saved successfully!", 3000);

      // Switch to Recipes tab to show the saved recipe
      setActiveTab("recipes");
    } catch (error: any) {
      console.error("Error saving recipe:", error);
      console.error("Error code:", error?.code);
      console.error("Error message:", error?.message);

      // Provide more specific error messages
      let errorMessage = "Failed to save recipe. Please try again.";

      if (error?.code === "permission-denied") {
        errorMessage =
          "Permission denied. Please check your Firestore security rules.";
      } else if (error?.code === "unavailable") {
        errorMessage =
          "Firestore service is temporarily unavailable. Please try again later.";
      } else if (error?.message) {
        errorMessage = `Error: ${error.message}`;
      }

      error(errorMessage, 5000);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/auth/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const copyRecipe = (recipe: Recipe) => {
    const text = `${recipe.title}\n\n${recipe.description ? recipe.description + '\n\n' : ''}Ingredients:\n${recipe.ingredients.join('\n')}\n\nInstructions:\n${recipe.instructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n')}\n\nPrep Time: ${recipe.prepTime}${recipe.cookingTime ? `\nCooking Time: ${recipe.cookingTime}` : ''}\nServings: ${recipe.servings}`;
    
    navigator.clipboard.writeText(text).then(() => {
      success('Recipe copied to clipboard!', 2000);
    }).catch(() => {
      error('Failed to copy recipe', 2000);
    });
  };

  const printRecipe = (recipe: Recipe) => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${recipe.title}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 40px; 
                max-width: 800px; 
                margin: 0 auto;
                line-height: 1.6;
              }
              h1 { 
                color: #ea580c; 
                margin-bottom: 10px;
                border-bottom: 3px solid #ea580c;
                padding-bottom: 10px;
              }
              .description {
                color: #666;
                font-style: italic;
                margin-bottom: 20px;
              }
              .meta { 
                color: #666; 
                margin: 20px 0;
                padding: 15px;
                background: #f9f9f9;
                border-radius: 8px;
              }
              h2 { 
                color: #333; 
                margin-top: 30px;
                border-left: 4px solid #ea580c;
                padding-left: 10px;
              }
              ul, ol { 
                margin: 15px 0;
                padding-left: 30px;
              }
              li { 
                margin: 8px 0;
              }
              .nutrition {
                background: #f0fdf4;
                border: 1px solid #86efac;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
              }
              .health-tips {
                background: #eff6ff;
                border: 1px solid #93c5fd;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
              }
              @media print {
                body { padding: 20px; }
              }
            </style>
          </head>
          <body>
            <h1>${recipe.title}</h1>
            ${recipe.description ? `<p class="description">${recipe.description}</p>` : ''}
            <div class="meta">
              <strong>Prep Time:</strong> ${recipe.prepTime} | 
              ${recipe.cookingTime ? `<strong>Cook Time:</strong> ${recipe.cookingTime} | ` : ''}
              <strong>Servings:</strong> ${recipe.servings}
              ${recipe.difficulty ? ` | <strong>Difficulty:</strong> ${recipe.difficulty}` : ''}
            </div>
            
            <h2>Ingredients</h2>
            <ul>${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
            
            <h2>Instructions</h2>
            <ol>${recipe.instructions.map(inst => `<li>${inst}</li>`).join('')}</ol>
            
            ${recipe.calories ? `
              <div class="nutrition">
                <h2>Nutrition Information (per serving)</h2>
                <p>
                  <strong>Calories:</strong> ${recipe.calories} kcal<br>
                  ${recipe.protein ? `<strong>Protein:</strong> ${recipe.protein}<br>` : ''}
                  ${recipe.carbs ? `<strong>Carbs:</strong> ${recipe.carbs}<br>` : ''}
                  ${recipe.fat ? `<strong>Fat:</strong> ${recipe.fat}` : ''}
                </p>
              </div>
            ` : ''}
            
            ${recipe.healthTips && recipe.healthTips.length > 0 ? `
              <div class="health-tips">
                <h2>Health Tips</h2>
                <ul>${recipe.healthTips.map(tip => `<li>${tip}</li>`).join('')}</ul>
              </div>
            ` : ''}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ show: true, recipeId: id });
  };

  const handleDeleteConfirm = async () => {
    const id = deleteConfirm.recipeId;
    if (!id || !user) {
      setDeleteConfirm({ show: false, recipeId: null });
      return;
    }

    // Find the recipe to get its title for updating savedRecipeIds
    const recipeToDelete = savedRecipes.find((r) => r.id === id);

    try {
      await deleteDoc(doc(db, "recipes", id));

      // Update saved recipe IDs immediately
      if (recipeToDelete?.title) {
        const normalizedTitle = recipeToDelete.title.toLowerCase().trim();
        setSavedRecipeIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(normalizedTitle);
          return newSet;
        });
      }

      // Reload recipes from Firestore to ensure consistency
      await loadRecipes(user.uid);

      success("Recipe deleted successfully!", 3000);
    } catch (err) {
      console.error("Error deleting recipe:", err);
      error("Failed to delete recipe. Please try again.", 5000);
    } finally {
      setDeleteConfirm({ show: false, recipeId: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ show: false, recipeId: null });
  };

  // Validate and sanitize ingredients before sending to API
  const validateAndSanitizeIngredients = (
    ingredientsToValidate: Ingredient[]
  ): Ingredient[] => {
    if (!Array.isArray(ingredientsToValidate)) {
      console.warn("Invalid ingredients array provided");
      return [];
    }

    return ingredientsToValidate
      .filter((ing) => {
        // Remove ingredients with missing or invalid data
        if (!ing || typeof ing !== "object") {
          console.warn("Skipping invalid ingredient object:", ing);
          return false;
        }

        if (!ing.id || typeof ing.id !== "string") {
          console.warn("Ingredient missing valid id:", ing);
          return false;
        }

        if (
          !ing.name ||
          typeof ing.name !== "string" ||
          ing.name.trim().length === 0
        ) {
          console.warn("Ingredient missing valid name:", ing);
          return false;
        }

        if (
          typeof ing.quantity !== "number" ||
          ing.quantity <= 0 ||
          !isFinite(ing.quantity)
        ) {
          console.warn("Ingredient has invalid quantity:", ing);
          return false;
        }

        if (
          !ing.unit ||
          typeof ing.unit !== "string" ||
          ing.unit.trim().length === 0
        ) {
          console.warn("Ingredient missing valid unit:", ing);
          return false;
        }

        if (
          !ing.type ||
          !["meat", "vegetable", "fish", "other"].includes(ing.type)
        ) {
          console.warn("Ingredient has invalid type:", ing);
          return false;
        }

        return true;
      })
      .map((ing) => ({
        ...ing,
        name: ing.name.trim(),
        unit: ing.unit.trim(),
        quantity: Math.max(0.1, Math.min(10000, ing.quantity)), // Clamp quantity to reasonable range
      }));
  };

  const handleGenerateRecipe = async (isRetry: boolean = false) => {
    // Validate minimum ingredients
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      warning("Please add at least 3 main ingredients to generate recipes");
      return;
    }

    if (ingredients.length < 3) {
      warning(
        `Please add at least 3 main ingredients (you currently have ${ingredients.length})`
      );
      return;
    }

    // Validate and sanitize ingredients
    const validIngredients = validateAndSanitizeIngredients(ingredients);

    if (validIngredients.length === 0) {
      error(
        "No valid ingredients found. Please ensure all ingredients have valid names, quantities, and units."
      );
      return;
    }

    if (validIngredients.length < 3) {
      warning(
        `Only ${validIngredients.length} valid ingredient(s) found. Please ensure all ingredients have valid names, quantities, and units. At least 3 valid ingredients are required.`
      );
      return;
    }

    setIsGenerating(true);

    // Increment retry count if this is a retry
    if (isRetry) {
      setRetryCount((prev) => prev + 1);
    } else {
      setRetryCount(0);
    }

    try {
      // Build comprehensive customization object based on ALL filter selections
      const customization = {
        // Dish Type
        dishType: dishType, // 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Brunch', 'Dessert'

        // Diet preferences
        diet: diet, // 'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Low-Carb', 'Pescatarian'
        vegetarian: diet === "Vegetarian",
        vegan: diet === "Vegan",
        keto: diet === "Keto",
        paleo: diet === "Paleo",
        lowCarb: diet === "Low-Carb",
        pescatarian: diet === "Pescatarian",

        // Time constraints
        timeConstraint: time, // '< 15 min', '< 30 min', '< 60 min'
        maxPrepTime: time === "< 15 min" ? 15 : time === "< 30 min" ? 30 : 60,

        // Goal
        goal: goal, // 'Eat Healthy', 'Planning', 'Budget'
        healthFocused: goal === "Eat Healthy",
        mealPlanning: goal === "Planning",
        budgetFriendly: goal === "Budget",

        // Additional context
        cuisine: "Filipino", // Can be made dynamic later
        servings: 4, // Default servings
      };

      const retryMessage = isRetry ? ` (Attempt ${retryCount + 1})` : "";
      console.log(`Generating recipes${retryMessage} with:`, {
        ingredients: validIngredients,
        customization,
      });

      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients: validIngredients,
          customization,
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error occurred" }));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();

      // Validate response structure
      if (!data || typeof data !== "object") {
        throw new Error("Invalid response format from server");
      }

      if (!data.recipes || !Array.isArray(data.recipes)) {
        throw new Error(
          "Invalid recipe format received - recipes array missing"
        );
      }

      if (data.recipes.length === 0) {
        throw new Error(
          "No recipes were generated. Please try again with different ingredients or filters."
        );
      }

      // Sanitize and validate each recipe
      const sanitizedRecipes = data.recipes
        .filter((recipe: any) => {
          if (!recipe || typeof recipe !== "object") {
            console.warn("Skipping invalid recipe object:", recipe);
            return false;
          }

          if (
            !recipe.title ||
            typeof recipe.title !== "string" ||
            recipe.title.trim().length === 0
          ) {
            console.warn("Recipe missing valid title:", recipe);
            return false;
          }

          // Validate ingredients array
          if (
            !Array.isArray(recipe.ingredients) ||
            recipe.ingredients.length === 0
          ) {
            console.warn("Recipe missing ingredients array:", recipe);
            return false;
          }

          // Validate instructions array
          if (
            !Array.isArray(recipe.instructions) ||
            recipe.instructions.length === 0
          ) {
            console.warn("Recipe missing instructions array:", recipe);
            return false;
          }

          // Validate servings
          if (typeof recipe.servings !== "number" || recipe.servings < 1) {
            console.warn("Recipe has invalid servings:", recipe);
            return false;
          }

          return true;
        })
        .map((recipe: any) => {
          return {
            title: (recipe.title || "Untitled Recipe").trim(),
            description:
              recipe.description && typeof recipe.description === "string"
                ? recipe.description.trim()
                : undefined,
            ingredients: Array.isArray(recipe.ingredients)
              ? recipe.ingredients
                  .filter(
                    (ing: any) =>
                      ing && typeof ing === "string" && ing.trim().length > 0
                  )
                  .map((ing: string) => ing.trim())
              : [],
            instructions: Array.isArray(recipe.instructions)
              ? recipe.instructions
                  .filter(
                    (inst: any) =>
                      inst && typeof inst === "string" && inst.trim().length > 0
                  )
                  .map((inst: string) => inst.trim())
              : [],
            prepTime:
              recipe.prepTime && typeof recipe.prepTime === "string"
                ? recipe.prepTime.trim()
                : "N/A",
            cookingTime:
              recipe.cookingTime && typeof recipe.cookingTime === "string"
                ? recipe.cookingTime.trim()
                : undefined,
            servings:
              typeof recipe.servings === "number" && recipe.servings > 0
                ? recipe.servings
                : 4,
            difficulty:
              recipe.difficulty && typeof recipe.difficulty === "string"
                ? recipe.difficulty.trim()
                : undefined,
            calories:
              typeof recipe.calories === "number" && recipe.calories > 0
                ? recipe.calories
                : undefined,
            protein:
              recipe.protein && typeof recipe.protein === "string"
                ? recipe.protein.trim()
                : undefined,
            carbs:
              recipe.carbs && typeof recipe.carbs === "string"
                ? recipe.carbs.trim()
                : undefined,
            fat:
              recipe.fat && typeof recipe.fat === "string"
                ? recipe.fat.trim()
                : undefined,
            healthTips: Array.isArray(recipe.healthTips)
              ? recipe.healthTips
                  .filter(
                    (tip: any) =>
                      tip && typeof tip === "string" && tip.trim().length > 0
                  )
                  .map((tip: string) => tip.trim())
              : undefined,
            cuisine:
              recipe.cuisine && typeof recipe.cuisine === "string"
                ? recipe.cuisine.trim()
                : "Filipino",
          };
        });

      if (sanitizedRecipes.length === 0) {
        throw new Error(
          "No valid recipes were generated. Please try again with different ingredients."
        );
      }

      // Log validation info if available
      if (data.validationInfo) {
        console.log("API Validation Info:", data.validationInfo);
        if (data.validationInfo.failedValidations > 0) {
          console.warn(
            `${data.validationInfo.failedValidations} recipe(s) failed validation on server`
          );
        }
      }

      setGeneratedRecipes(sanitizedRecipes);
      const successMsg = isRetry
        ? `Successfully regenerated ${sanitizedRecipes.length} recipe(s)!`
        : `Successfully generated ${sanitizedRecipes.length} recipe(s)!`;
      success(successMsg, 3000);

      // Scroll to the first generated recipe
      setTimeout(() => {
        const firstRecipe = document.querySelector("[data-generated-recipe]");
        if (firstRecipe) {
          firstRecipe.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to generate recipes. Please try again.";
      error(message, 5000);
      console.error("Recipe generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id));
  };

  const getIngredientImage = (name: string) => {
    return `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop&q=80`;
  };

  const getIngredientCalories = (name: string) => {
    const calories: { [key: string]: number } = {
      chicken: 165,
      rice: 130,
      tomato: 18,
      potato: 77,
      onion: 40,
      garlic: 149,
      pork: 242,
      fish: 206,
    };
    return calories[name.toLowerCase()] || 100;
  };

  // Render Home Tab
  const renderHomeTab = () => (
    <>
      {/* Build Your Recipe Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-center mb-6">
          Build Your Recipe
        </h1>

        {/* Ingredients Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">Ingredients</span>
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold">
              {ingredients.length}
            </span>
          </div>
          {ingredients.length > 0 && (
            <button
              onClick={() => setActiveTab("ingredients")}
              className="text-sm text-orange-600 dark:text-orange-400 hover:underline"
            >
              See all
            </button>
          )}
        </div>

        {/* Horizontal Scrollable Ingredient Cards */}
        {ingredients.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-2 mb-4 scrollbar-hide">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className="flex-shrink-0 w-32 bg-white dark:bg-card rounded-xl shadow-sm border border-border overflow-hidden"
              >
                <div className="relative h-24 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30">
                  <img
                    src={getIngredientImage(ingredient.name)}
                    alt={ingredient.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <button
                    onClick={() => removeIngredient(ingredient.id)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 dark:bg-card/90 flex items-center justify-center shadow-sm hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
                <div className="p-2">
                  <p className="text-xs font-semibold truncate">
                    {ingredient.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getIngredientCalories(ingredient.name)} avg. calories per
                    100g
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ingredient Manager - Always visible to add more ingredients */}
        <div className="mb-6">
          <Card className="border-none shadow-sm dark:bg-card/50">
            <CardContent className="pt-6">
              <IngredientManager
                ingredients={ingredients}
                onIngredientsChange={setIngredients}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recipe Filters */}
      <div className="space-y-6 mb-8">
        {/* Dish Type */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
            Dish Type
          </h3>
          <div className="flex gap-2 flex-wrap">
            {["Breakfast", "Lunch", "Dinner", "Snack", "Brunch", "Dessert"].map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setDishType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    dishType === type
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                      : "bg-amber-50 dark:bg-amber-950/30 text-foreground hover:bg-amber-100 dark:hover:bg-amber-900/40"
                  }`}
                >
                  {type}
                </button>
              )
            )}
          </div>
        </div>

        {/* Diet */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
            Diet
          </h3>
          <div className="flex gap-2 flex-wrap">
            {[
              "Vegetarian",
              "Vegan",
              "Keto",
              "Paleo",
              "Low-Carb",
              "Pescatarian",
            ].map((dietType) => {
              // Check if current diet option should be disabled (Vegetarian/Vegan with meat/fish)
              const hasMeatOrFish = ingredients.some(
                (ing) => ing.type === "meat" || ing.type === "fish"
              );
              const shouldDisable =
                hasMeatOrFish && (dietType === "Vegetarian" || dietType === "Vegan");

              return (
                <button
                  key={dietType}
                  onClick={() => !shouldDisable && setDiet(dietType)}
                  disabled={shouldDisable}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    diet === dietType
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                      : shouldDisable
                      ? "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50"
                      : "bg-amber-50 dark:bg-amber-950/30 text-foreground hover:bg-amber-100 dark:hover:bg-amber-900/40"
                  }`}
                  title={
                    shouldDisable
                      ? "Cannot select - ingredients contain meat or fish"
                      : ""
                  }
                >
                  {dietType}
                  {shouldDisable && <span className="ml-1 text-xs">🚫</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
            Time
          </h3>
          <div className="flex gap-2 flex-wrap">
            {["< 15 min", "< 30 min", "< 60 min"].map((timeOption) => (
              <button
                key={timeOption}
                onClick={() => setTime(timeOption)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  time === timeOption
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                    : "bg-amber-50 dark:bg-amber-950/30 text-foreground hover:bg-amber-100 dark:hover:bg-amber-900/40"
                }`}
              >
                {timeOption}
              </button>
            ))}
          </div>
        </div>

        {/* Goal */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
            Goal
          </h3>
          <div className="flex gap-2 flex-wrap">
            {["Eat Healthy", "Planning", "Budget"].map((goalOption) => (
              <button
                key={goalOption}
                onClick={() => setGoal(goalOption)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  goal === goalOption
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                    : "bg-amber-50 dark:bg-amber-950/30 text-foreground hover:bg-amber-100 dark:hover:bg-amber-900/40"
                }`}
              >
                {goalOption}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Recipe Button */}
      <div className="mb-8">
        <Button
          onClick={() => handleGenerateRecipe(false)}
          disabled={ingredients.length < 3 || isGenerating}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all h-12 text-base font-semibold"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-5 h-5 mr-2 animate-spin" />
              Generating Recipe...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 mr-2" />
              Generate Recipe
            </>
          )}
        </Button>
      </div>

      {/* Generated Recipes Display */}
      {generatedRecipes.length > 0 && (
        <div className="space-y-6 mb-8">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-2xl font-bold tracking-tight">Your Recipes</h2>
            <div className="flex gap-2">
              <Button
                onClick={() => handleGenerateRecipe(true)}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950/30"
              >
                🔄 Regenerate
                {retryCount > 0 && <span className="ml-1">({retryCount})</span>}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setGeneratedRecipes([]);
                  setRetryCount(0);
                }}
                className="border-orange-200 hover:bg-orange-50 dark:border-orange-800 dark:hover:bg-orange-950/30"
              >
                Clear
              </Button>
            </div>
          </div>
          {generatedRecipes.map((recipe, index) => {
            const isSaved = isRecipeSaved(recipe.title || "");
            return (
              <div
                key={index}
                className="space-y-4"
                data-generated-recipe={index === 0 ? "first" : undefined}
              >
                <RecipeCard recipe={recipe} />
                <Button
                  onClick={() => handleSaveRecipe(recipe)}
                  disabled={isSaved}
                  className={`w-full shadow-md transition-all ${
                    isSaved
                      ? "bg-green-500 hover:bg-green-600 text-white cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                  }`}
                >
                  {isSaved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Recipe Saved
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 mr-2" />
                      Save This Recipe
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  // Render Ingredients Tab
  const renderIngredientsTab = () => (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">My Ingredients</h1>
      <Card className="border-none shadow-md dark:bg-card/50">
        <CardHeader>
          <CardTitle className="tracking-tight">Add Ingredients</CardTitle>
          <CardDescription className="text-muted-foreground/80 leading-relaxed">
            Add at least 3 main ingredients (you can add more as needed)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IngredientManager
            ingredients={ingredients}
            onIngredientsChange={setIngredients}
          />
        </CardContent>
      </Card>

      {ingredients.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">
            Current Ingredients ({ingredients.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {ingredients.map((ingredient) => (
              <Card
                key={ingredient.id}
                className="border-none shadow-sm dark:bg-card/50 overflow-hidden"
              >
                <div className="relative h-32 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30">
                  <img
                    src={getIngredientImage(ingredient.name)}
                    alt={ingredient.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <button
                    onClick={() => removeIngredient(ingredient.id)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 dark:bg-card/90 flex items-center justify-center shadow-sm hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
                <CardContent className="p-3">
                  <p className="font-semibold text-sm truncate">
                    {ingredient.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {ingredient.quantity} {ingredient.unit}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getIngredientCalories(ingredient.name)} cal/100g
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Render Profile Tab
  const renderProfileTab = () => (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">My Profile</h1>

      <div className="space-y-6">
        {/* User Info Card */}
        <Card className="border-none shadow-md dark:bg-card/50">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="tracking-tight">
                  Account Information
                </CardTitle>
                <CardDescription className="text-muted-foreground/80 leading-relaxed">
                  Your account details and preferences
                </CardDescription>
              </div>
              {!isEditingProfile ? (
                <Button
                  onClick={handleEditProfile}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveProfile}
                    size="sm"
                    className="gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-tight">
                  {userProfile?.firstName || userProfile?.lastName
                    ? `${userProfile.firstName || ""} ${
                        userProfile.lastName || ""
                      }`.trim()
                    : user?.displayName || "User"}
                </h3>
                <p className="text-muted-foreground/80">{user?.email}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-3">
              {!isEditingProfile ? (
                <>
                  {userProfile?.firstName && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground/80">
                        First Name
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        {userProfile.firstName}
                      </span>
                    </div>
                  )}
                  {userProfile?.lastName && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground/80">
                        Last Name
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        {userProfile.lastName}
                      </span>
                    </div>
                  )}
                  {userProfile?.contactNo && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground/80">
                        Contact Number
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        {userProfile.contactNo}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      First Name
                    </label>
                    <Input
                      value={editedProfile.firstName}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          firstName: e.target.value,
                        })
                      }
                      placeholder="Enter first name"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Last Name
                    </label>
                    <Input
                      value={editedProfile.lastName}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          lastName: e.target.value,
                        })
                      }
                      placeholder="Enter last name"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Contact Number
                    </label>
                    <Input
                      value={editedProfile.contactNo}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          contactNo: e.target.value,
                        })
                      }
                      placeholder="Enter contact number"
                      className="w-full"
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground/80">
                  User ID
                </span>
                <span className="text-sm font-mono text-foreground/70">
                  {user?.uid?.substring(0, 8)}...
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground/80">
                  Saved Recipes
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {savedRecipes.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground/80">
                  Current Ingredients
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {ingredients.length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Card */}
        <Card className="border-none shadow-md dark:bg-card/50">
          <CardHeader>
            <CardTitle className="tracking-tight">Your Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-orange-50/80 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {savedRecipes.length}
                </div>
                <div className="text-sm text-muted-foreground/80">
                  Favorite Recipes
                </div>
              </div>
              <div className="p-4 rounded-lg bg-green-50/80 dark:bg-green-950/30 border border-green-100 dark:border-green-900">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {ingredients.length}
                </div>
                <div className="text-sm text-muted-foreground/80">
                  Ingredients Added
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Card className="border-none shadow-md dark:bg-card/50">
          <CardContent className="pt-6">
            <Button
              onClick={handleSignOut}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transition-all"
              size="lg"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Render Recipes Tab
  const renderRecipesTab = () => (
    <div className="mb-8 space-y-8">
      {/* Saved Recipes Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-6">
          My Favorite Recipes
        </h1>
        {loading ? (
          <Card className="border-none shadow-sm dark:bg-card/50">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground/80">Loading recipes...</p>
            </CardContent>
          </Card>
        ) : savedRecipes.length === 0 ? (
          <Card className="border-none shadow-sm dark:bg-card/50">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground/80">
                No saved recipes yet. Start generating recipes to save your
                favorites!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {savedRecipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className="relative cursor-pointer group"
              >
                <Card className="border-none shadow-sm dark:bg-card/50 hover:shadow-md transition-all hover:scale-[1.02] transform duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors truncate">
                          {recipe.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground/80 mt-1 flex-wrap">
                          <span className="flex items-center gap-1">
                            ⏱️ {recipe.prepTime}
                          </span>
                          {recipe.cookingTime && (
                            <span className="flex items-center gap-1">
                              🍳 {recipe.cookingTime}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            🍽️ {recipe.servings} servings
                          </span>
                          {recipe.difficulty && (
                            <span className="flex items-center gap-1">
                              📊 {recipe.difficulty}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (recipe.id) handleDeleteClick(recipe.id);
                        }}
                        className="ml-4 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors border border-gray-200 dark:border-gray-700 flex-shrink-0"
                        title="Delete recipe"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suggested Filipino Recipes Section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">
          Suggested Filipino Recipes 🇵🇭
        </h2>
        <p className="text-muted-foreground/80 mb-6">
          Popular Filipino dishes you might enjoy
        </p>
        <div className="space-y-3">
          {suggestedFilipinoRecipes.map((recipe, index) => {
            const isSaved = isRecipeSaved(recipe.title || "");
            return (
              <div
                key={index}
                onClick={() => setSelectedRecipe(recipe)}
                className="relative cursor-pointer group"
              >
                <Card className="border-none shadow-sm dark:bg-card/50 hover:shadow-md transition-all hover:scale-[1.02] transform duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors truncate">
                          {recipe.title}
                        </h3>
                        <p className="text-sm text-muted-foreground/80 mt-1 line-clamp-2">
                          {recipe.description}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground/80 mt-2 flex-wrap">
                          <span className="flex items-center gap-1">
                            ⏱️ {recipe.prepTime}
                          </span>
                          {recipe.cookingTime && (
                            <span className="flex items-center gap-1">
                              🍳 {recipe.cookingTime}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            🍽️ {recipe.servings} servings
                          </span>
                          {recipe.difficulty && (
                            <span className="flex items-center gap-1">
                              📊 {recipe.difficulty}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveRecipe(recipe);
                        }}
                        disabled={isSaved}
                        className={`ml-4 flex-shrink-0 shadow-md transition-all ${
                          isSaved
                            ? "bg-green-500 hover:bg-green-600 text-white cursor-not-allowed"
                            : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                        }`}
                        size="sm"
                      >
                        {isSaved ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            <Heart className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/40 via-white to-white dark:from-orange-950/20 dark:via-background dark:to-background pb-24">
      <Header />
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <main className="container mx-auto px-4 sm:px-6 py-6 max-w-6xl">
        {activeTab === "home" && renderHomeTab()}
        {activeTab === "ingredients" && renderIngredientsTab()}
        {activeTab === "recipes" && renderRecipesTab()}
        {activeTab === "profile" && renderProfileTab()}

        {/* Recipe Detail Modal */}
        {selectedRecipe && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelectedRecipe(null)}
          >
            <div
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-card border border-border shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <h2 className="text-3xl font-bold tracking-tight">
                    {selectedRecipe.title}
                  </h2>
                  <button
                    onClick={() => setSelectedRecipe(null)}
                    className="text-2xl text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>

                {selectedRecipe.description && (
                  <p className="mb-4 text-muted-foreground/80">
                    {selectedRecipe.description}
                  </p>
                )}

                <div className="mb-6 flex gap-4 text-sm text-muted-foreground/80">
                  <span>⏱️ Prep: {selectedRecipe.prepTime}</span>
                  {selectedRecipe.cookingTime && (
                    <span>🍳 Cook: {selectedRecipe.cookingTime}</span>
                  )}
                  <span>🍽️ Serves: {selectedRecipe.servings}</span>
                </div>

                <div className="mb-6">
                  <h3 className="mb-3 text-xl font-semibold tracking-tight">
                    Ingredients:
                  </h3>
                  <ul className="list-inside list-disc space-y-2">
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="text-foreground/90">
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="mb-3 text-xl font-semibold tracking-tight">
                    Instructions:
                  </h3>
                  <ol className="space-y-3">
                    {selectedRecipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-xs text-white shadow-sm">
                          {index + 1}
                        </span>
                        <span className="text-foreground/90">
                          {instruction}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

                {selectedRecipe.calories && (
                  <div className="mb-6">
                    <button
                      onClick={() => setShowNutrition(!showNutrition)}
                      className="mb-2 flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
                    >
                      <span>{showNutrition ? '▼' : '▶'}</span>
                      <span>{showNutrition ? 'Hide' : 'Show'} Nutrition Information</span>
                    </button>
                    {showNutrition && (
                      <div className="rounded-md bg-green-50/80 dark:bg-green-950/30 border border-green-100 dark:border-green-900 p-4">
                        <h3 className="mb-3 text-xl font-semibold text-green-900 dark:text-green-400 tracking-tight">
                          Nutrition (per serving)
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="font-medium text-green-700 dark:text-green-300">
                              Calories:
                            </span>{" "}
                            <span className="text-green-600 dark:text-green-400">
                              {selectedRecipe.calories} kcal
                            </span>
                          </div>
                          {selectedRecipe.protein && (
                            <div>
                              <span className="font-medium text-green-700 dark:text-green-300">
                                Protein:
                              </span>{" "}
                              <span className="text-green-600 dark:text-green-400">
                                {selectedRecipe.protein}
                              </span>
                            </div>
                          )}
                          {selectedRecipe.carbs && (
                            <div>
                              <span className="font-medium text-green-700 dark:text-green-300">
                                Carbs:
                              </span>{" "}
                              <span className="text-green-600 dark:text-green-400">
                                {selectedRecipe.carbs}
                              </span>
                            </div>
                          )}
                          {selectedRecipe.fat && (
                            <div>
                              <span className="font-medium text-green-700 dark:text-green-300">
                                Fat:
                              </span>{" "}
                              <span className="text-green-600 dark:text-green-400">
                                {selectedRecipe.fat}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedRecipe.healthTips &&
                  selectedRecipe.healthTips.length > 0 && (
                    <div className="mb-6">
                      <button
                        onClick={() => setShowHealthTips(!showHealthTips)}
                        className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                      >
                        <span>{showHealthTips ? '▼' : '▶'}</span>
                        <span>{showHealthTips ? 'Hide' : 'Show'} Health Tips</span>
                      </button>
                      {showHealthTips && (
                        <div className="rounded-md bg-blue-50/80 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-4">
                          <h3 className="mb-3 text-xl font-semibold text-blue-900 dark:text-blue-400 tracking-tight">
                            Health Tips
                          </h3>
                          <ul className="list-inside list-disc space-y-2 text-blue-800 dark:text-blue-200">
                            {selectedRecipe.healthTips.map((tip, tipIdx) => (
                              <li key={tipIdx}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                {/* Action Buttons */}
                <div className="flex gap-3 mb-4">
                  <Button
                    onClick={() => printRecipe(selectedRecipe)}
                    variant="outline"
                    className="flex-1"
                  >
                    🖨️ Print
                  </Button>
                  <Button
                    onClick={() => copyRecipe(selectedRecipe)}
                    variant="outline"
                    className="flex-1"
                  >
                    📋 Copy
                  </Button>
                </div>

                <Button
                  onClick={() => setSelectedRecipe(null)}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm.show && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={handleDeleteCancel}
          >
            <div
              className="bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Delete Recipe
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete this recipe? This action cannot
                be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  onClick={handleDeleteCancel}
                  variant="outline"
                  className="border-gray-300 dark:border-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteConfirm}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-background border-t border-border shadow-lg z-40">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-around py-2">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex flex-col items-center gap-1 py-2 px-4 transition-colors ${
                activeTab === "home"
                  ? "text-orange-500"
                  : "text-muted-foreground"
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs font-medium">Home</span>
            </button>
            <button
              onClick={() => setActiveTab("ingredients")}
              className={`flex flex-col items-center gap-1 py-2 px-4 transition-colors relative ${
                activeTab === "ingredients"
                  ? "text-orange-500"
                  : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                <List className="w-5 h-5" />
                {ingredients.length > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold">
                    {ingredients.length}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">Ingredients</span>
            </button>
            <button
              onClick={() => setActiveTab("recipes")}
              className={`flex flex-col items-center gap-1 py-2 px-4 transition-colors relative ${
                activeTab === "recipes"
                  ? "text-orange-500"
                  : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                <BookOpen className="w-5 h-5" />
                {savedRecipes.length > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold">
                    {savedRecipes.length}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">Recipes</span>
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex flex-col items-center gap-1 py-2 px-4 transition-colors ${
                activeTab === "profile"
                  ? "text-orange-500"
                  : "text-muted-foreground"
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
