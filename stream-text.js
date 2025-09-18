import "dotenv/config";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";

const result = streamText({
    model: google("gemini-2.0-flash", {
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
    }),
    prompt: 'who is rocking star yash ? ',

})



for await (const text of result.textStream) {
    console.log(text);
}

console.log("--------------------------------")

async function resultdata(result) {

    const source = await result.sources;
    console.log(source);

}

resultdata(result);
