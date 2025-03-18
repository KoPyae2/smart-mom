import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export interface Ingredient {
  name: string;
  qty: string;
}

export interface Step {
  english: string;
  myanmar: string;
}

export interface Dish {
  name: string;
  ingredients: Ingredient[];
  steps: Step[];
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
    vitamins: string;
  };
  imagePrompt: string;
}

export interface MealPlan {
  main_dish: Dish;
}

export interface RecipeResponse {
  meal_plan: MealPlan;
}

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const generateSystemPrompt = (
  ingredients: string[],
  mealType: string,
  duration: string,
  peopleCount: number,
  isRegeneration: boolean = false
) => {
  const basePrompt = `
    You are a professional chef specializing in Myanmar cuisine. Create a recipe based on these ingredients: ${ingredients.join(
      ", "
    )}.
    This is for ${mealType}, should take about ${duration} to prepare, and serves ${peopleCount} people.
    
    Make sure the recipe reflects authentic Myanmar culinary traditions and flavors.
    ${isRegeneration ? "Create an improved version of the recipe with clear, detailed steps. Focus on making the most delicious dish possible with the available ingredients." : ""}
    
    VERY IMPORTANT: Focus ONLY on creating one main dish, not a side dish. For each ingredient and in the dish name, provide both English and Myanmar language names. For the dish name, include the Myanmar name in Myanmar script in parentheses. For each ingredient, include the Myanmar name in Myanmar script in parentheses after the English name. Also provide the cooking steps in both English and Myanmar languages.
    
    Provide the response in the following JSON format ONLY. DO NOT wrap the JSON in markdown code blocks (do not use triple backticks). DO NOT include any text before or after the JSON:
    
    {
      "meal_plan": {
        "main_dish": {
          "name": "English Name (မြန်မာအမည်)",
          "ingredients": [
            {"name": "English ingredient name (မြန်မာအမည်)", "qty": "amount"},
            {"name": "English ingredient name (မြန်မာအမည်)", "qty": "amount"}
          ],
          "steps": [
            {
              "english": "English instruction for step 1",
              "myanmar": "မြန်မာဘာသာဖြင့် အဆင့် ၁ ညွှန်ကြားချက်"
            },
            {
              "english": "English instruction for step 2",
              "myanmar": "မြန်မာဘာသာဖြင့် အဆင့် ၂ ညွှန်ကြားချက်"
            }
          ],
          "nutrition": {
            "calories": number,
            "protein": "amount",
            "carbs": "amount",
            "fat": "amount",
            "fiber": "amount",
            "vitamins": "key vitamins and minerals"
          },
          "imagePrompt": "A detailed text prompt describing the finished dish that could be used to generate an AI image"
        }
      }
    }
  `;

  return basePrompt;
};

export const generateRecipe = async (
  ingredients: string[],
  mealType: string,
  duration: string,
  peopleCount: number,
  isRegeneration: boolean = false
): Promise<RecipeResponse> => {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
    
    const prompt = generateSystemPrompt(ingredients, mealType, duration, peopleCount, isRegeneration);
    
    const result = await chatSession.sendMessage(prompt);
    const text = result.response.text();
    
    console.log("Raw response:", text);
    
    // Extract JSON from the response - handle various markdown formats
    let jsonContent = text;
    
    // Remove markdown code blocks if present
    if (text.includes("```json")) {
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        jsonContent = jsonMatch[1];
      }
    } else if (text.includes("```")) {
      const jsonMatch = text.match(/```\n?([\s\S]*?)\n?```/);
      if (jsonMatch && jsonMatch[1]) {
        jsonContent = jsonMatch[1];
      }
    }
    
    // Additional cleanup to ensure we have valid JSON
    jsonContent = jsonContent.trim();
    
    console.log("Cleaned JSON:", jsonContent);
    
    try {
      // Parse the JSON response
      const parsedJson = JSON.parse(jsonContent);
      
      // Ensure we only have a main dish (no side dish)
      if (parsedJson && parsedJson.meal_plan && 'side_dish' in parsedJson.meal_plan) {
        const mealPlan = parsedJson.meal_plan as Record<string, unknown>;
        delete mealPlan.side_dish;
      }
      
      // Log the image prompt for debugging or future use
      if (parsedJson?.meal_plan?.main_dish?.imagePrompt) {
        console.log("Image Prompt:", parsedJson.meal_plan.main_dish.imagePrompt);
      }
      
      return parsedJson as RecipeResponse;
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      // Try to find a JSON object in the response using regex
      const jsonObjectMatch = jsonContent.match(/\{[\s\S]*\}/);
      if (jsonObjectMatch) {
        const parsedJson = JSON.parse(jsonObjectMatch[0]);
        
        // Ensure we only have a main dish (no side dish)
        if (parsedJson && parsedJson.meal_plan && 'side_dish' in parsedJson.meal_plan) {
          const mealPlan = parsedJson.meal_plan as Record<string, unknown>;
          delete mealPlan.side_dish;
        }
        
        // Log the image prompt here as well to ensure it's captured in all cases
        if (parsedJson?.meal_plan?.main_dish?.imagePrompt) {
          console.log("Image Prompt:", parsedJson.meal_plan.main_dish.imagePrompt);
        }
        
        return parsedJson as RecipeResponse;
      }
      throw parseError;
    }
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw new Error("Failed to generate recipe. Please try again.");
  }
}; 