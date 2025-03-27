import { useState, useEffect } from 'react';
import { RecipeResponse, Dish } from '../services/gemini';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateImage } from '../services/imageGeneration';
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface RecipeOptionsProps {
  recipe: RecipeResponse;
  onSelectRecipe: (dish: Dish) => void;
}

interface DishCardProps {
  dish: Dish;
  index: number;
  isSelected: boolean;
  onSelect: (dish: Dish, index: number) => void;
  imageUrl: string | null;
  isLoading: boolean;
}

const DishCard = ({ dish, index, isSelected, onSelect, imageUrl, isLoading }: DishCardProps) => {
  return (
    <Card 
      className={`overflow-hidden border-amber-200 backdrop-blur-sm transition-all duration-300 transform hover:scale-102 cursor-pointer gap-0 ${
        isSelected ? 'ring-2 ring-amber-500' : ''}`}
      onClick={() => onSelect(dish, index)}
    >
      <div className="overflow-hidden relative h-48 bg-amber-50">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={dish.name}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex flex-col justify-center items-center h-full">
            {isLoading ? (
              <>
                <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
                <p className="mt-2 text-sm text-amber-800">Generating image...</p>
              </>
            ) : (
              <div className="text-center text-amber-600">
                <p className="text-sm">No image available</p>
              </div>
            )}
          </div>
        )}
        <div className="absolute top-2 right-2 px-2 py-1 text-sm font-semibold text-amber-900 rounded-full bg-amber-100/90">
          {dish.nutrition.calories} calories
        </div>
      </div>

      <CardHeader className="py-4 bg-gradient-to-r from-amber-50 to-amber-100/30">
        <CardTitle className="text-xl text-amber-900">{dish.name}</CardTitle>
        <CardDescription className="text-base text-amber-700 font-myanmar">
          {dish.name.match(/\((.*?)\)/)?.[1]}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        <div>
          <h4 className="flex items-center mb-2 text-sm font-semibold text-amber-800">
            <span className="inline-block mr-2 w-4 h-4">🥘</span>
            Key Ingredients
          </h4>
          <ul className="space-y-1">
            {dish.ingredients.slice(0, 3).map((ingredient, idx) => (
              <li key={idx} className="text-sm text-gray-600">
                • {ingredient.name}
              </li>
            ))}
            {dish.ingredients.length > 3 && (
              <li className="text-sm italic text-amber-600">
                + {dish.ingredients.length - 3} more ingredients
              </li>
            )}
          </ul>
        </div>

        <Separator className="bg-amber-200" />

        <div>
          <h4 className="flex items-center mb-2 text-sm font-semibold text-amber-800">
            <span className="inline-block mr-2 w-4 h-4">📊</span>
            Nutrition Highlights
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="px-2 py-1.5 text-xs bg-amber-100 rounded-lg">
              <span className="block text-amber-700">Protein</span>
              <span className="font-semibold text-amber-900">{dish.nutrition.protein}</span>
            </div>
            <div className="px-2 py-1.5 text-xs bg-amber-100 rounded-lg">
              <span className="block text-amber-700">Carbs</span>
              <span className="font-semibold text-amber-900">{dish.nutrition.carbs}</span>
            </div>
          </div>
        </div>

        <Button 
          className="mt-2 w-full bg-amber-600 transition-colors hover:bg-amber-700"
          onClick={() => onSelect(dish, index)}
        >
          <span className="mr-2">✨</span>
          Select This Recipe
        </Button>
      </CardContent>
    </Card>
  );
};

export default function RecipeOptions({ recipe, onSelectRecipe }: RecipeOptionsProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [images, setImages] = useState<(string | null)[]>([]);
  const [loadingImages, setLoadingImages] = useState<boolean[]>([]);

  useEffect(() => {
    const generateImages = async () => {
      // Initialize loading states
      setLoadingImages(recipe.meal_plan.options.map(() => true));
      
      // Generate all images in parallel
      const imagePromises = recipe.meal_plan.options.map(async (dish, index) => {
        if (!dish.imagePrompt) return null;
        
        try {
          const imageUrl = await generateImage(dish.imagePrompt);
          // Update loading state for this specific image
          setLoadingImages(prev => {
            const newState = [...prev];
            newState[index] = false;
            return newState;
          });
          return imageUrl;
        } catch (error) {
          console.error(`Error generating image for recipe ${index + 1}:`, error);
          // Update loading state for this specific image
          setLoadingImages(prev => {
            const newState = [...prev];
            newState[index] = false;
            return newState;
          });
          return null;
        }
      });

      // Wait for all images to be generated
      const generatedImages = await Promise.all(imagePromises);
      setImages(generatedImages);
    };

    generateImages();
  }, [recipe.meal_plan.options]);

  const handleSelect = (dish: Dish, index: number) => {
    setSelectedIndex(index);
    onSelectRecipe(dish);
  };

  return (
    <div className="mt-8 mb-6 space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold text-amber-900 scroll-m-20">Choose Your Recipe</h2>
        <p className="text-lg text-amber-700 font-myanmar">သင့်စိတ်ကြိုက် ဟင်းလျာကို ရွေးချယ်ပါ</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {recipe.meal_plan.options.map((dish, index) => (
          <DishCard
            key={index}
            dish={dish}
            index={index}
            isSelected={selectedIndex === index}
            onSelect={handleSelect}
            imageUrl={images[index]}
            isLoading={loadingImages[index]}
          />
        ))}
      </div>
    </div>
  );
} 