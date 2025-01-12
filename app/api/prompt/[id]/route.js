import Prompt from "@/models/prompt";
import { connectToDB } from "@/utils/database";

// Helper function to handle common errors
const createErrorResponse = (message, status = 500) => {
  return new Response(message, { status });
};

// GET: Fetch a specific prompt by ID
export const GET = async (request, { params }) => {
  try {
    // Connect to the database
    await connectToDB();

    // Fetch the prompt by ID and populate creator details
    const prompt = await Prompt.findById(params.id).populate("creator");
    if (!prompt) {
      return createErrorResponse("Prompt Not Found", 404);
    }

    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    console.error("Error fetching prompt:", error);
    return createErrorResponse("Internal Server Error");
  }
};

// PATCH: Update an existing prompt
export const PATCH = async (request, { params }) => {
  try {
    // Parse the request body
    const { prompt, tag } = await request.json();

    // Connect to the database
    await connectToDB();

    // Find the existing prompt by ID
    const existingPrompt = await Prompt.findById(params.id);
    if (!existingPrompt) {
      return createErrorResponse("Prompt Not Found", 404);
    }

    // Update the prompt with new data
    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;

    // Save the updated prompt
    await existingPrompt.save();

    return new Response("Prompt updated successfully", { status: 200 });
  } catch (error) {
    console.error("Error updating prompt:", error);
    return createErrorResponse("Error updating prompt");
  }
};

// DELETE: Delete a specific prompt
export const DELETE = async (request, { params }) => {
  try {
    // Connect to the database
    await connectToDB();

    // Check if the ID is provided
    if (!params.id) {
      return createErrorResponse("Prompt ID is required", 400);
    }

    // Find and delete the prompt by ID
    const deletedPrompt = await Prompt.findByIdAndDelete(params.id);
    if (!deletedPrompt) {
      return createErrorResponse("Prompt Not Found", 404);
    }

    return new Response("Prompt deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting prompt:", error);
    return createErrorResponse("Error deleting prompt");
  }
};
