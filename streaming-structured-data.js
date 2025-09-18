import "dotenv/config";
import z, { array } from 'zod';
import { streamObject } from "ai";
import { google } from "@ai-sdk/google";

const result = streamObject({
    model: google("gemini-2.0-flash", { apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY }),
    prompt: "What is the recipe for Biryani ?",
    output: "array",
    schema: z.object({
        recipe: z.object({
            name: z.string(),
            ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
            steps: z.array(z.string()),
        }),
    }),
    onError({ error }) {
        console.log(error);
    },
});

for await (const partialData of result.elementStream) {
    console.log(partialData);
}