import {
  RichTextEditor,
  Link,
  useRichTextEditorContext,
} from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

import "@mantine/tiptap/styles.css";
import { useCallback, useEffect, useState } from "react";
import { FileButton } from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";

function ImageUploadButton() {
  const { editor } = useRichTextEditorContext();

  return (
    <FileButton
      accept="image/*"
      onChange={(file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          editor?.commands.setImage({src: base64, alt: "image"});
        };
        reader.readAsDataURL(file!);
      }}
    >
      {(props) => (
        <RichTextEditor.Control
          {...props}
          aria-label="Insert image"
          title="Insert image"
        >
          <IconPhoto stroke={1.5} size="1rem" />
        </RichTextEditor.Control>
      )}
    </FileButton>
  );
}

export default function Editor({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: string) => void;
}) {
  const [content, setContent] = useState<string | undefined>(value);

  const handleChange = useCallback(
    (newContent: string) => {
      if (newContent !== content) {
        setContent(newContent);
        onChange(newContent);
      }
    },
    [content, onChange]
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Underline,
      Image.configure({
        allowBase64: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      handleChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (value !== content) {
      setContent(value);
    }
  }, [value, content]);

  return (
    <RichTextEditor editor={editor} style={{minHeight: '300px'}}>
      <RichTextEditor.Toolbar sticky stickyOffset={60}>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <ImageUploadButton />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
