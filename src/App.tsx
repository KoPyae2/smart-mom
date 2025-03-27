import { useState } from 'react'
import RecipeForm from './components/RecipeForm'
import RecipeDisplay from './components/RecipeDisplay'
import RecipeOptions from './components/RecipeOptions'
import { generateRecipe, RecipeResponse, Dish } from './services/gemini'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

function App() {
  const [recipeOptions, setRecipeOptions] = useState<RecipeResponse | null>(null)
  const [selectedRecipe, setSelectedRecipe] = useState<Dish | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateRecipe = async (data: {
    ingredients: string[]
    mealType: string
    duration: string
    peopleCount: number
    cookingMethod: string
  }) => {
    setLoading(true)
    setError(null)
    setSelectedRecipe(null)
    
    try {
      const recipeData = await generateRecipe(
        data.ingredients,
        data.mealType,
        data.duration,
        data.peopleCount,
        data.cookingMethod
      )
      
      setRecipeOptions(recipeData)
    } catch (err) {
      console.error('Error generating recipe:', err)
      setError('Failed to generate recipe. Please try again with using vpn.')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectRecipe = (dish: Dish) => {
    setSelectedRecipe(dish)
  }

  const handleRegenerateRecipe = (newRecipe: RecipeResponse) => {
    setRecipeOptions(newRecipe)
    setSelectedRecipe(null)
  }

  return (
    <div className="min-h-screen bg-fixed bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="container px-4 py-12 pb-24 mx-auto">
        <header className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex justify-center items-center w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full shadow-lg transition-transform duration-300 transform hover:scale-105">
              <span className="text-5xl text-white">🍲</span>
            </div>
          </div>
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-amber-900 drop-shadow-sm md:text-5xl scroll-m-20">
            Recipe Generator
          </h1>
          <h2 className="mb-4 text-2xl text-amber-700 font-myanmar">
            မြန်မာဟင်းလျာ ဖန်တီးရေး
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-amber-800 text-muted-foreground">
            Generate authentic Myanmar cuisine recipes based on your ingredients, 
            tailored to your preferences and dining needs
          </p>
        </header>

        <div className="mx-auto max-w-3xl backdrop-blur-sm">
          {!recipeOptions && <RecipeForm onSubmit={handleGenerateRecipe} isLoading={loading} />}
                    
          {error && (
            <Alert variant="destructive" className="mt-6">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {!loading && recipeOptions && !selectedRecipe && (
            <>
              <RecipeOptions 
                recipe={recipeOptions} 
                onSelectRecipe={handleSelectRecipe}
              />
              <div className="mt-8 text-center">
                <Button
                  onClick={() => setRecipeOptions(null)}
                  variant="outline"
                  className="text-amber-700 border-amber-300 hover:text-amber-900 hover:bg-amber-100 hover:border-amber-400"
                >
                  ← Generate different options
                </Button>
              </div>
            </>
          )}

          {selectedRecipe && (
            <>
              <RecipeDisplay 
                recipe={{ meal_plan: { main_dish: selectedRecipe } }} 
                onRegenerateRecipe={handleRegenerateRecipe} 
              />
              <div className="mt-8 text-center">
                <Button
                  onClick={() => setSelectedRecipe(null)}
                  variant="outline"
                  className="text-amber-700 border-amber-300 hover:text-amber-900 hover:bg-amber-100 hover:border-amber-400"
                >
                  ← Choose a different recipe
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
