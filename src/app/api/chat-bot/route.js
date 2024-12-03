import { NextResponse } from "next/server";
import axios from "axios";

const SAMBANOVA_API_KEY = process.env.SAMBANOVA_API_KEY?.trim();
const SAMBANOVA_API_URL = "https://api.sambanova.ai/v1";

export async function POST(req) {
  try {
    const { userMessage } = await req.json();

    // Validate the user input
    if (!userMessage) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    if (!SAMBANOVA_API_KEY) {
      console.error(
        "SAMBANOVA_API_KEY is not defined. Please set it in the .env file."
      );
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Make the API call to SambaNova
    const response = await axios.post(
      `${SAMBANOVA_API_URL}/chat/completions`,
      {
        model: "Meta-Llama-3.1-8B-Instruct",
        messages: [
          { role: "system", content: "You are a helpful assistant" },
          { role: "user", content: userMessage },
        ],
        temperature: 0.1,
        top_p: 0.1,
      },
      {
        headers: {
          Authorization: `Bearer ${SAMBANOVA_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Return the AI response
    return NextResponse.json({
      reply: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.error(
      "SambaNova API call failed:",
      error.response?.data || error.message
    );

    // Return a server error
    return NextResponse.json(
      {
        error: "Failed to get response from the bot.",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
