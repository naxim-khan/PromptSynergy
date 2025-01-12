import Prompt from "@/models/prompt";
import { connectToDB } from "@/utils/database";

export const POST = async (request) => {
  try {
    // Parse the JSON body
    const { userId, prompt, tag } = await request.json();

    // Validate request body
    if (!userId || !prompt || !tag) {
      return new Response("Missing required fields", { status: 400 });
    }

    // Connect to the database
    await connectToDB();

    // Create and save the new prompt
    const newPrompt = new Prompt({ creator: userId, prompt, tag });
    await newPrompt.save();

    // Return success response
    return new Response(JSON.stringify(newPrompt), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating a new prompt:", error);

    // Return error response
    return new Response(
      JSON.stringify({ error: "Failed to create a new prompt" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};