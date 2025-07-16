'use client';

import { api } from '@/convex/_generated/api';
import { askGemini } from '@/configs/AIModel'; 
import { useAction, useMutation } from 'convex/react';
import {
  Bold,
  Italic,
  Underline,
  Subscript,
  Superscript,
  Code,
  Highlighter,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';
import { toast } from "sonner"
import { useUser } from '@clerk/nextjs';

function EditorExtension({ editor }) {
  if (!editor) return null;

  const { fileId } = useParams();
  const SearchAI = useAction(api.myAction.search);
  const saveNotes=useMutation(api.notes.AddNotes)
  const { user }=useUser();
  const onAiClick = async () => {
    toast("AI is getting your answer..")
    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      ' '
    );
    if (!selectedText) return;

    const result = await SearchAI({
      query: selectedText,
      fileId: fileId,
    });

    const UnformattedAns = result;
let AllUnformattedAns = '';

if (result && typeof result === 'object' && result.answer) {
  AllUnformattedAns = result.answer;
} else {
  console.warn("Unexpected SearchAI result:", result);
  return;
}

const PROMPT =
  `Answer the following question using ONLY the provided content. ` +
  `Do not add any external knowledge. Use clean HTML like <p>, <strong>, or <ul>.\n\n` +
  `Question: ${selectedText}\n\nContent:\n${AllUnformattedAns}`;



console.log("📄 Sent to Gemini:\n", AllUnformattedAns);

console.log("🟩 FINAL PROMPT ===>\n", PROMPT);

    const FinalAns = await askGemini(PROMPT);
    const cleanedResponse = FinalAns
  .replace(/```/g, '')
  .replace(/html/g, '')
  .trim();
    const AllText = editor.getHTML();
    editor.commands.setContent(
      AllText + '<p><strong>Answer: </strong>' + cleanedResponse + '</p>'
    );

    saveNotes({
        notes:editor.getHTML(),
        fileId:fileId,
        createdBy:user?.primaryEmailAddress?.emailAddress
    })
  };


  const btnClass = (isActive) =>
    `p-2 rounded-md hover:bg-gray-100 ${
      isActive ? 'bg-gray-200 text-blue-600' : 'text-gray-700'
    }`;

  return (
    <div className="p-4 border-b flex flex-wrap gap-2 items-center">
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive('heading', { level: 1 }))} title="Heading 1">
        <Heading1 size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))} title="Heading 2">
        <Heading2 size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnClass(editor.isActive('heading', { level: 3 }))} title="Heading 3">
        <Heading3 size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))} title="Bold">
        <Bold size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))} title="Italic">
        <Italic size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive('underline'))} title="Underline">
        <Underline size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleSubscript().run()} className={btnClass(editor.isActive('subscript'))} title="Subscript">
        <Subscript size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleSuperscript().run()} className={btnClass(editor.isActive('superscript'))} title="Superscript">
        <Superscript size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleCode().run()} className={btnClass(editor.isActive('code'))} title="Inline Code">
        <Code size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={btnClass(editor.isActive('highlight'))} title="Highlight">
        <Highlighter size={18} />
      </button>
      <button onClick={onAiClick} className="hover:text-blue-500" title="AI Generate Answer">
        <Sparkles size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} className={btnClass(editor.isActive('strike'))} title="Strike">
        <Strikethrough size={18} />
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btnClass(editor.isActive({ textAlign: 'left' }))} title="Align Left">
        <AlignLeft size={18} />
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btnClass(editor.isActive({ textAlign: 'center' }))} title="Align Center">
        <AlignCenter size={18} />
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={btnClass(editor.isActive({ textAlign: 'right' }))} title="Align Right">
        <AlignRight size={18} />
      </button>
    </div>
  );
}

export default EditorExtension;
