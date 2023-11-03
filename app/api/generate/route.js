import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

const config = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export const runtime = "edge";

export async function POST(req) {
  let { prompt: content } = await req.json();

  let response;
  let getContent = content.split("#!#");
  let clearContent = getContent[1].replace(/\n/g, " ").replace(/\/$/, "");

  if (getContent[0] === "CONTINUE") {
    response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-16k",
      messages: [
        {
          role: "system",
          content:
            "You are an AI writing assistant that continues existing text based on context from prior text. " +
            "Give more weight/priority to the later characters than the beginning ones.",
        },
        {
          role: "user",
          content: clearContent,
        },
      ],
      max_tokens: 4000,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: true,
      n: 1,
    });
  } else if (getContent[0] === "OUTLINE") {
    response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI writing assistant that writing outline from the given title."
        },
        {
          role: "user",
          content: clearContent,
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: true,
      n: 1,
    });
  }


  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}