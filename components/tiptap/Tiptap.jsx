"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useCompletion } from "ai/react";
import { TiptapExtensions } from "./TiptapExtension";
import { TiptapProps } from "./TiptapProps";
import { useEffect, useRef } from "react";
import { useWriteStore } from "../../utils/store";

const Tiptap = () => {
  const setDescription = useWriteStore((state) => state.setDescription);

  const { completion, isLoading } = useCompletion({
    id: "novel",
    api: "/api/generate",
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error("You have reached your request limit for the day.");
        return;
      }
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  const editor = useEditor({
    extensions: TiptapExtensions,
    editorProps: TiptapProps,
    autofocus: "end",
    onUpdate: (e) => {
      setDescription(e.editor.getHTML());
    },
  });

  const prev = useRef("");

  useEffect(() => {
    const diff = completion.slice(prev.current.length);
    prev.current = completion;
    editor?.commands.insertContent(diff);
  }, [isLoading, editor, completion]);

  return (
    <div
      onClick={() => {
        editor?.chain().focus().run();
      }}
      className="relative min-h-[500px] w-full max-w-screen-lg border border-gray-200 px-4 py-2 rounded-md"
    >
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
