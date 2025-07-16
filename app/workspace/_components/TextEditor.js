import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Code from '@tiptap/extension-code';
import TextAlign from '@tiptap/extension-text-align';
import Heading from '@tiptap/extension-heading';

import EditorExtension from './EditorExtension';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';

const TextEditor = forwardRef(({ fileId }, ref) => {
  const { user } = useUser();

  const notes = useQuery(api.notes.GetNotes, {
    fileId: fileId,
  });

  const addNotes = useMutation(api.notes.AddNotes);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ underline: false, heading: false }),
      Heading.configure({ levels: [1, 2, 3] }),
      Underline,
      Highlight,
      Subscript,
      Superscript,
      Code,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Start Taking your notes here...' }),
    ],
    editorProps: {
      attributes: {
        class: 'focus:outline-none h-screen p-5',
      },
    },
  });

  // Load notes into editor
  useEffect(() => {
    if (editor && notes) {
      editor.commands.setContent(notes);
    }
  }, [editor, notes]);

  // Expose saveContent() to parent
  useImperativeHandle(ref, () => ({
    async saveContent() {
      if (!editor || !user) return;

      const content = editor.getHTML();
      await addNotes({
        fileId,
        notes: content,
        createdBy: user.id,
      });

      console.log('Notes saved successfully.');
    },
  }));

  return (
    <div>
      <EditorExtension editor={editor} />
      <div className="overflow-scroll h-[88vh]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
});

export default TextEditor;
