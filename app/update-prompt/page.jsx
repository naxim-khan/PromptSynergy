"use client";
// Using dynamic import to disable SSR for this component
import { Suspense } from 'react';
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Dynamically import the Form component and disable SSR
const Form = dynamic(() => import("../../components/Form"), { ssr: false });

const UpdatePrompt = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promptId = searchParams.get("id");

  const [post, setPost] = useState({ prompt: "", tag: "" });
  const [submitting, setIsSubmitting] = useState(false);

  // Fetch prompt details on client-side
  useEffect(() => {
    if (promptId) {
      const getPromptDetails = async () => {
        const response = await fetch(`/api/prompt/${promptId}`);
        const data = await response.json();

        setPost({
          prompt: data.prompt,
          tag: data.tag,
        });
      };

      getPromptDetails();
    }
  }, [promptId]);

  const updatePrompt = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!promptId) return alert("Missing PromptId!");

    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: "PATCH",
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag,
        }),
      });

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Suspense should only wrap the dynamically imported component (Form)
    <div>
      <Form
        type="Edit"
        post={post}
        setPost={setPost}
        submitting={submitting}
        handleSubmit={updatePrompt}
      />
    </div>
  );
};

export default UpdatePrompt;