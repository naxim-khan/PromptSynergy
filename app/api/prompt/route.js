import Prompt from "@/models/prompt";
import { connectToDB } from "@/utils/database";

// 🔥 This tells Next.js: DO NOT STATICALLY CACHE THIS ROUTE
export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    // Ensure database connection
    await connectToDB();

    // Fetch all prompts and populate creator details
    const prompts = await Prompt.find({}).populate("creator");

    return new Response(JSON.stringify(prompts), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store", // Ensures fresh data on every fetch
      },
    });
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return new Response("Failed to fetch all prompts", { status: 500 });
  }
};
