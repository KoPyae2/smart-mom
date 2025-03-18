import { useState } from 'react'
import RecipeForm from './components/RecipeForm'
import RecipeDisplay from './components/RecipeDisplay'
import { generateRecipe, RecipeResponse } from './services/gemini'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

function App() {
  const [recipe, setRecipe] = useState<RecipeResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateRecipe = async (data: {
    ingredients: string[]
    mealType: string
    duration: string
    peopleCount: number
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      const recipeData = await generateRecipe(
        data.ingredients,
        data.mealType,
        data.duration,
        data.peopleCount
      )
      
      setRecipe(recipeData)
    } catch (err) {
      console.error('Error generating recipe:', err)
      setError('Failed to generate recipe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerateRecipe = (newRecipe: RecipeResponse) => {
    setRecipe(newRecipe);
    // Scroll to top so user can see the new recipe
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          {!recipe && <RecipeForm onSubmit={handleGenerateRecipe} isLoading={loading} />}
                    
          {error && (
            <Alert variant="destructive" className="mt-6">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {!loading && recipe && (
            <>
              <RecipeDisplay 
                recipe={recipe} 
                onRegenerateRecipe={handleRegenerateRecipe} 
              />
              <div className="mt-8 text-center">
                <Button
                  onClick={() => setRecipe(null)}
                  variant="outline"
                  className="text-amber-700 border-amber-300 hover:text-amber-900 hover:bg-amber-100 hover:border-amber-400"
                >
                  ← Generate a different recipe
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
