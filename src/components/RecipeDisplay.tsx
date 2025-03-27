import { useState, useEffect } from 'react';
import { RecipeResponse, Dish, generateRecipe } from '../services/gemini';
import { generateImage } from '../services/imageGeneration';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Loader2 } from "lucide-react";

interface RecipeDisplayProps {
  recipe: {
    meal_plan: {
      main_dish: Dish;
    };
  };
  onRegenerateRecipe: (newRecipe: RecipeResponse) => void;
}

const DishDisplay = ({ dish, type }: { dish: Dish; type: 'main' | 'side' }) => {
  const [language, setLanguage] = useState<'english' | 'myanmar'>('english');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    const generateInitialImage = async () => {
      if (!dish.imagePrompt || isGeneratingImage) return;
      
      console.log('Image Prompt:', dish.imagePrompt);
      setIsGeneratingImage(true);
      setImageError(null);
      
      try {
        console.log('Generating image...');
        const imageUrl = await generateImage(dish.imagePrompt);
        console.log('Image generated:', imageUrl);
        setGeneratedImage(imageUrl);
      } catch (error) {
        console.error('Error generating image:', error);
        setImageError('Failed to generate image. Please try again.');
      } finally {
        setIsGeneratingImage(false);
      }
    };

    generateInitialImage();
  }, [dish.imagePrompt]);

  const handleImageLoad = () => {
    console.log('Image loaded successfully');
  };

  const handleImageError = () => {
    console.error('Error loading image');
    setImageError('Failed to load image. Please try again.');
  };

  const handleRegenerateImage = async () => {
    if (!dish.imagePrompt) return;

    setIsGeneratingImage(true);
    setImageError(null);

    try {
      console.log('Regenerating image...');
      const imageUrl = await generateImage(dish.imagePrompt);
      console.log('Image regenerated:', imageUrl);
      setGeneratedImage(imageUrl);
    } catch (error) {
      console.error('Error regenerating image:', error);
      setImageError('Failed to regenerate image. Please try again.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <Card className="mb-6 border-amber-200 backdrop-blur-sm transition-transform duration-300 transform bg-amber-50/30">
      <CardHeader className="py-6 pb-3 bg-gradient-to-r from-amber-100 to-amber-50 rounded-t-lg">
        <div className="flex flex-col gap-4 justify-between items-center md:flex-row">
          <div>
            <CardTitle className="text-lg text-amber-900 md:text-2xl">{dish.name}</CardTitle>
            <CardDescription className="text-base text-amber-700 md:text-lg">
              {type === 'main' ? 'Main Dish' : 'Side Dish'} • {dish.nutrition.calories} calories
            </CardDescription>
          </div>
          <Tabs value={language} onValueChange={(value) => setLanguage(value as 'english' | 'myanmar')} className="w-auto transition-all duration-300">
            <TabsList className="grid grid-cols-2 w-[200px]">
              <TabsTrigger value="english">English</TabsTrigger>
              <TabsTrigger value="myanmar">မြန်မာ</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {dish.imagePrompt && (
          <>
            <div>
              <h4 className="flex items-center mb-3 text-lg font-semibold text-amber-900">
                <span className="inline-block flex justify-center items-center mr-2 w-8 h-8 bg-amber-300 rounded-full">🖼️</span>
                Recipe Image
              </h4>
              <div className="overflow-hidden relative rounded-lg border border-amber-200">
                {generatedImage ? (
                  <img 
                    src={generatedImage} 
                    alt={dish.name}
                    className="object-cover w-full h-auto opacity-1 animate-fadeIn"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                ) : (
                  <div className="flex flex-col items-center p-8 text-center bg-amber-50">
                    <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
                    <p className="mt-2 text-amber-800">Generating your recipe image...</p>
                  </div>
                )}
              </div>
              
              {imageError && (
                <div className="p-2 mt-2 text-sm text-red-700 bg-red-50 rounded-md">
                  {imageError}
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2"
                    onClick={handleRegenerateImage}
                  >
                    Regenerate
                  </Button>
                </div>
              )}
            </div>
            <Separator className="bg-amber-200" />
          </>
        )}

        <div>
          <h4 className="flex items-center mb-3 text-lg font-semibold text-amber-900">
            <span className="inline-block flex justify-center items-center mr-2 w-8 h-8 bg-amber-300 rounded-full">🍚</span>
            Ingredients
          </h4>
          <ul className="pl-3 space-y-2">
            {dish.ingredients.map((ingredient, index) => (
              <li key={index} className="flex text-base">
                <span className="mr-2 text-amber-500">•</span>
                <span className="font-medium">{ingredient.name}</span>
                <span className="mx-2 text-gray-400">-</span>
                <span className="text-gray-600">{ingredient.qty}</span>
              </li>
            ))}
          </ul>
        </div>

        <Separator className="bg-amber-200" />

        <div>
          <h4 className="flex items-center mb-3 text-lg font-semibold text-amber-900">
            <span className="inline-block flex justify-center items-center mr-2 w-8 h-8 bg-amber-300 rounded-full">👨‍🍳</span>
            Cooking Steps
          </h4>
          <ol className="relative -ml-3 space-y-4">
            {dish.steps.map((step, index) => (
              <li key={index} className="relative">
                <div className="flex relative gap-2 items-center pl-4">
                  <p className='h-6 text-sm font-semibold text-center text-amber-800 bg-amber-200 rounded-full border border-amber-300 min-w-6'>{index + 1}</p>
                  <p className="text-gray-700">
                    {language === 'english' ? step.english : step.myanmar}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <Separator className="bg-amber-200" />

        <div>
          <h4 className="flex items-center mb-3 text-lg font-semibold text-amber-900">
            <span className="inline-block flex justify-center items-center mr-2 w-8 h-8 bg-amber-300 rounded-full">📊</span>
            Nutrition Information
          </h4>
        </div>
        <div className="grid grid-cols-2 gap-4 pb-6 md:grid-cols-3">
          <div className="px-4 py-3 bg-amber-100 rounded-lg shadow-sm">
            <span className="text-sm text-amber-700">Calories</span>
            <p className="text-xl font-bold text-amber-900">{dish.nutrition.calories}</p>
          </div>
          <div className="px-4 py-3 bg-green-100 rounded-lg shadow-sm">
            <span className="text-sm text-green-700">Protein</span>
            <p className="text-xl font-bold text-green-900">{dish.nutrition.protein}</p>
          </div>
          <div className="px-4 py-3 bg-blue-100 rounded-lg shadow-sm">
            <span className="text-sm text-blue-700">Carbs</span>
            <p className="text-xl font-bold text-blue-900">{dish.nutrition.carbs}</p>
          </div>
          <div className="px-4 py-3 bg-purple-100 rounded-lg shadow-sm">
            <span className="text-sm text-purple-700">Fat</span>
            <p className="text-xl font-bold text-purple-900">{dish.nutrition.fat}</p>
          </div>
          <div className="px-4 py-3 bg-orange-100 rounded-lg shadow-sm">
            <span className="text-sm text-orange-700">Fiber</span>
            <p className="text-xl font-bold text-orange-900">{dish.nutrition.fiber}</p>
          </div>
          <div className="px-4 py-3 bg-teal-100 rounded-lg shadow-sm">
            <span className="text-sm text-teal-700">Vitamins & Minerals</span>
            <p className="text-base font-medium text-teal-900">{dish.nutrition.vitamins}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function RecipeDisplay({ recipe, onRegenerateRecipe }: RecipeDisplayProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  if (!recipe) return null;

  const { meal_plan } = recipe;
  const mainDish = meal_plan.main_dish;

  const handleIngredientToggle = (ingredientName: string) => {
    if (selectedIngredients.includes(ingredientName)) {
      setSelectedIngredients(selectedIngredients.filter(name => name !== ingredientName));
    } else {
      setSelectedIngredients([...selectedIngredients, ingredientName]);
    }
  };

  const handleRegenerateRecipe = async () => {
    if (selectedIngredients.length === 0) {
      setError("Please select at least one ingredient you have");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Extract ingredient names (without Myanmar part in parentheses)
      const cleanIngredients = selectedIngredients.map(ing => {
        const match = ing.match(/^([^(]+)/);
        return match ? match[1].trim() : ing;
      });

      const newRecipe = await generateRecipe(
        cleanIngredients,
        'main dish', // Default to main dish
        '45 minutes', // Default duration
        4, // Default serving size
        'curry', // Default cooking method
        true // This is a regeneration
      );

      onRegenerateRecipe(newRecipe);
    } catch (err) {
      console.error('Error regenerating recipe:', err);
      setError('Failed to regenerate recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 mb-6 space-y-6">
      <h2 className="mb-6 text-3xl font-bold text-center text-amber-900 scroll-m-20">Your Recipe</h2>

      <DishDisplay dish={mainDish} type="main" />

      <Card className="border-amber-200 backdrop-blur-sm bg-amber-50/30">
        <CardHeader className="py-6 bg-gradient-to-r from-amber-100 to-amber-50 rounded-t-l">
          <CardTitle className="flex items-center text-amber-900">
            <span className="inline-block flex justify-center items-center mr-2 w-8 h-8 bg-amber-300 rounded-full">🧺</span>
            Select Ingredients You Have
          </CardTitle>
          <CardDescription className="text-amber-700 font-myanmar">သင့်တွင်ရှိသော ပါဝင်ပစ္စည်းများကို ရွေးချယ်ပါ</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="mb-4">
            <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {mainDish.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`ingredient-${index}`}
                    checked={selectedIngredients.includes(ingredient.name)}
                    onCheckedChange={() => handleIngredientToggle(ingredient.name)}
                    className="text-amber-600 border-amber-400 focus:ring-amber-500"
                  />
                  <label
                    htmlFor={`ingredient-${index}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {ingredient.name} ({ingredient.qty})
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {error && (
            <div className="flex items-center p-3 mb-4 text-sm text-red-700 bg-red-50 rounded-md border border-red-200">
              <AlertCircle className="mr-2 w-4 h-4" />
              {error}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-4 mb-6 bg-gradient-to-b from-transparent rounded-b-lg sm:flex-row to-amber-100/40">
          <Button
            onClick={handleRegenerateRecipe}
            disabled={loading}
            className="w-full bg-amber-600 sm:flex-1 hover:bg-amber-700"
            variant="default"
          >
            {loading ? (
              <span className="flex justify-center items-center">
                <svg className="mr-2 -ml-1 w-4 h-4 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Regenerating...
              </span>
            ) : (
              'Regenerate Recipe With Selected Ingredients'
            )}
          </Button>

          <Button
            onClick={() => window.print()}
            variant="outline"
            className="w-full text-amber-800 border-amber-300 sm:w-auto hover:bg-amber-100"
          >
            Print Recipe
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

<style>{`
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fadeIn {
    animation: fadeIn 1s ease-in-out forwards;
  }
`}</style> 