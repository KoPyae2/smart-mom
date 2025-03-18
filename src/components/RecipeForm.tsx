import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Loader2, Plus, Utensils, Clock, Users } from "lucide-react";

interface RecipeFormInputs {
  ingredients: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  duration: string;
  peopleCount: number;
}

interface RecipeFormProps {
  onSubmit: (data: {
    ingredients: string[];
    mealType: string;
    duration: string;
    peopleCount: number;
  }) => void;
  isLoading: boolean;
}

const MEAL_TYPES = [
  { value: 'breakfast', english: 'Breakfast', myanmar: 'မနက်စာ' },
  { value: 'lunch', english: 'Lunch', myanmar: 'နေ့လည်စာ' },
  { value: 'dinner', english: 'Dinner', myanmar: 'ညစာ' },
  { value: 'snack', english: 'Snack', myanmar: 'အစားအစာ' }
];

const DURATIONS = ['15 minutes', '30 minutes', '45 minutes', '1 hour', '1.5 hours', '2 hours'];

export default function RecipeForm({ onSubmit, isLoading }: RecipeFormProps) {
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredientList, setIngredientList] = useState<string[]>([]);

  const form = useForm<RecipeFormInputs>();
  const { handleSubmit } = form;

  const addIngredient = () => {
    if (ingredientInput.trim() !== '') {
      setIngredientList([...ingredientList, ingredientInput.trim()]);
      setIngredientInput('');
    }
  };

  const removeIngredient = (index: number) => {
    const newList = [...ingredientList];
    newList.splice(index, 1);
    setIngredientList(newList);
  };

  const handleFormSubmit = (data: RecipeFormInputs) => {
    if (ingredientList.length === 0) {
      alert('Please add at least one ingredient');
      return;
    }

    onSubmit({
      ingredients: ingredientList,
      mealType: data.mealType,
      duration: data.duration,
      peopleCount: data.peopleCount || 2,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  return (
    <Card className="overflow-hidden relative border-amber-200 backdrop-blur-sm bg-amber-50/30">
      {isLoading && (
        <div className="flex absolute inset-0 z-10 flex-col justify-center items-center bg-white bg-opacity-75">
          <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
          <p className="mt-2 text-amber-800">Cooking up your recipe...</p>
          <p className="mt-2 text-amber-700 font-myanmar">သင့်မြန်မာဟင်းလျာကို ပြင်ဆင်နေပါသည်...</p>
        </div>
      )}
      <CardHeader className="py-6 bg-gradient-to-r from-amber-100 to-amber-50 rounded-t-lg">
        <CardTitle className="flex gap-2 items-center text-2xl text-amber-900">
          <span className="inline-block flex justify-center items-center w-8 h-8 text-white bg-amber-400 rounded-full">🍳</span>
          Recipe Generator
        </CardTitle>
        <CardDescription className="text-lg text-amber-700 font-myanmar">ဟင်းလျာဖန်တီးရန်</CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <CardContent className="pt-6 space-y-8">
            {/* Ingredients Section */}
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 shadow-sm">
              <div className="flex gap-2 items-center mb-3">
                <div className="w-1 h-6 bg-amber-200 rounded-full"></div>
                <FormLabel className="text-lg font-medium text-amber-900">Ingredients</FormLabel>
              </div>
              <FormDescription className="mb-4 text-amber-700 font-myanmar">ပါဝင်ပစ္စည်းများ</FormDescription>
              
              <div className="flex gap-2 mb-4">
                <Input
                  type="text"
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  placeholder="Add an ingredient"
                  onKeyDown={handleKeyPress}
                  className="text-amber-900 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                />
                <Button 
                  type="button" 
                  onClick={addIngredient}
                  variant="secondary"
                  className="text-amber-900 bg-amber-200 hover:bg-amber-300"
                >
                  <Plus className="mr-1 w-4 h-4" />
                  Add
                </Button>
              </div>
              
              {ingredientList.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-4 min-h-[60px] bg-white p-3 rounded-md border border-amber-100">
                  {ingredientList.map((ingredient, index) => (
                    <Badge key={index} variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200 py-1.5 px-3">
                      {ingredient}
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="ml-1.5 rounded-full hover:bg-amber-300 h-4 w-4 inline-flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center min-h-[60px] text-amber-500 bg-white p-3 rounded-md border border-amber-100 text-sm italic">
                  Add ingredients to start creating your recipe
                </div>
              )}
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Meal Type */}
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 shadow-sm">
                <div className="flex gap-2 items-center mb-3">
                  <Utensils className="w-4 h-4 text-amber-600" />
                  <FormLabel className="text-amber-900">Meal Type</FormLabel>
                </div>
                <FormDescription className="mb-3 text-sm text-amber-700 font-myanmar">အစားအစာအမျိုးအစား</FormDescription>
                <FormField
                  control={form.control}
                  name="mealType"
                  render={({ field }) => (
                    <FormItem>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-amber-200 focus:ring-amber-400">
                            <SelectValue placeholder="Select meal type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {MEAL_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.english} ({type.myanmar})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              {/* Duration */}
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 shadow-sm">
                <div className="flex gap-2 items-center mb-3">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <FormLabel className="text-amber-900">Duration</FormLabel>
                </div>
                <FormDescription className="mb-3 text-sm text-amber-700 font-myanmar">ချက်ပြုတ်ချိန်</FormDescription>
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-amber-200 focus:ring-amber-400">
                            <SelectValue placeholder="Cooking time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DURATIONS.map((duration) => (
                            <SelectItem key={duration} value={duration}>
                              {duration}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              {/* People Count */}
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 shadow-sm">
                <div className="flex gap-2 items-center mb-3">
                  <Users className="w-4 h-4 text-amber-600" />
                  <FormLabel className="text-amber-900">Servings</FormLabel>
                </div>
                <FormDescription className="mb-3 text-sm text-amber-700 font-myanmar">လူဦးရေ</FormDescription>
                <FormField
                  control={form.control}
                  name="peopleCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          defaultValue={2}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 2)}
                          className="text-amber-900 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center pt-4 pb-6 bg-gradient-to-b from-transparent to-amber-100/40">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-amber-600 hover:bg-amber-700 text-white min-w-[200px] py-6"
            >
              {isLoading ? (
                <span className="flex justify-center items-center">
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  Creating Recipe...
                </span>
              ) : (
                <span className="flex justify-center items-center text-lg">
                  Generate Myanmar Recipe
                  <span className="ml-2">✨</span>
                </span>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
} 