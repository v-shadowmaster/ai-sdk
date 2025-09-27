import "dotenv/config";
import { generateText, tool } from "ai";
import { google } from "@ai-sdk/google";
import z from "zod";
import { stepCountIs } from "ai";

/*
tools are objects that can be called by the model to perform
a specific task. AI SDK Core tools contain three elements:

    description: An optional description of the tool that can 
                 influence when the tool is picked.

    inputSchema: A Zod schema or a JSON schema that defines the
                 input parameters. The schema is consumed by the LLM,
                 and also used to validate the LLM tool calls.

    execute    : An optional async function that is called with the
                 inputs from the tool call. It produces a value of 
                 type RESULT (generic type). It is optional because 
                 you might want to forward tool calls to the client 
                 or to a queue instead of executing them in the same
                 process.
*/

const main = async () => {
    const result = await generateText({
        model: google("gemini-2.0-flash", { apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY }),
        prompt: "What is the weather in London and New york ?",
        tools: {

            weather: tool({
                description: "Get the weather in a location",
                inputSchema: z.object({
                    location: z.string().describe("The location to get the weather for"),
                }),
                execute: async ({ location }) => ({
                    location,
                    temperature: 72 + Math.floor(Math.random() * 21) - 10,
                }),
            }),



            answer: tool({
                description: "Use this for general questions not related to tools",
                inputSchema: z.object({
                    query: z.string().describe("The question to answer directly"),
                }),
                execute: async ({ query }) => {
                    const subResult = await generateText({
                        model: google("gemini-2.0-flash", {
                            apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
                        }),
                        prompt: query,
                        // 🔑 no tools here → freeform LLM response
                    });

                    return { response: subResult.text };
                },
            })
        },
        maxSteps: 5,

    });
    console.log(result.steps);
};


main().catch(console.error)