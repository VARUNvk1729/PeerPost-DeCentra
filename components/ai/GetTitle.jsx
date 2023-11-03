"use client";

import { useWriteStore } from "../../utils/store";
import { Icon } from "@iconify/react";
import { Configuration, OpenAIApi } from 'openai'
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function GetTitle() {
  const config = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(config);

  const [prompt, setPrompt] = useState("");
  const [apiResponse, setApiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const setTitle = useWriteStore((state) => state.setTitle);
  const setShowModalTitle = useWriteStore((state) => state.setShowModalTitle);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Give me 7 Article ideas from the following topics: ${prompt}\nPlease format the result with json.\nExample [{"topic": "Blockchain","idea": "Exploring the Potential of Blockchain Technology in Healthcare"}]`,
        temperature: 0.5,
        max_tokens: 4000,
      });
      const list = result.data.choices[0].text;
      setApiResponse(JSON.parse(list));
    } catch (e) {
      toast.error("Something is going wrong, Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-2 mb-2">
            <label htmlFor="topic" className="text-sm font-medium">
              Topic
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                defaultValue={prompt}
                placeholder="Example: blockchain, web development, react, etc"
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full rounded border-gray-300"
              />
              <button
                disabled={loading || prompt.length === 0}
                type="submit"
                className="flex items-end justify-center gap-1 font-bold text-sm text-lime bg-primary-800 px-4 py-2.5 rounded-md hover:shadow-lg hover:shadow-primary-800/20 hover:-translate-y-px transition-all hover:contrast-125 disabled:contrast-50 disabled:cursor-not-allowed"
              >
                <span>{loading ? "Generating" : "Generate"}</span>
                {loading && <Icon icon="eos-icons:three-dots-loading" className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </form>
      </div>
      {apiResponse && (
        <div className="space-y-1">
          {apiResponse.map((i) => (
            <button
              key={i?.idea}
              onClick={() => {
                setTitle(i?.idea);
                setShowModalTitle(false);
              }}
              className="flex items-center gap-2 p-2 border rounded w-full hover:bg-lime group"
            >
              <div className="relative shrink-0 w-5 h-5 overflow-hidden">
                <Icon icon="ph:circle-bold" className="absolute top-0 left-0 w-5 h-5" />
                <Icon icon="ph:check-circle-bold" className="absolute top-0 -left-5 w-5 h-5 group-hover:left-0 transition-all" />
              </div>
              <p className="flex-1 text-left text-sm">{i?.idea}</p>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
