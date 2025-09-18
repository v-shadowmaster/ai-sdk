import "dotenv/config";
import z from "zod";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

const result = await generateObject({
    model: google("gemini-2.0-flash", { apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY }),
    schema: z.object({
        recipe: z.object({
            name: z.string(),
            ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
            steps: z.array(z.string()),
        }),
    }),
    prompt: "What is the recipe for Biryani ?",
})

console.log(result.object);

console.log("------------------------------");

console.log(result.object.recipe.ingredients);
