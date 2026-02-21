"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  ImageIcon,
  Youtube as YoutubeIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function TiptapEditor({
  value,
  onChange,
  placeholder = "Écrivez votre article ici…",
}: TiptapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: false }),
      Youtube.configure({ controls: true, nocookie: true }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder }),
    ],
    immediatelyRender: false,
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose max-w-none focus:outline-none min-h-[300px] p-4",
      },
    },
  });

  const uploadImage = useCallback(
    async (file: File) => {
      if (!editor) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/admin/blog/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json();
          alert(err.error || "Erreur lors de l'upload");
          return;
        }

        const { url } = await res.json();
        editor.chain().focus().setImage({ src: url }).run();
      } catch {
        alert("Erreur lors de l'upload de l'image");
      }
    },
    [editor]
  );

  const handleImageFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) uploadImage(file);
      e.target.value = "";
    },
    [uploadImage]
  );

  const setLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("URL du lien :", editor.getAttributes("link").href);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addYoutube = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("URL YouTube :");
    if (url) {
      editor.commands.setYoutubeVideo({ src: url });
    }
  }, [editor]);

  if (!editor) return null;

  const toolbarBtn = (active: boolean) =>
    cn(
      "h-8 w-8 p-0",
      active && "bg-accent text-accent-foreground"
    );

  return (
    <div className="rounded-md border border-input bg-background">
      {/* Toolbar */}
      <div role="toolbar" aria-label="Barre d'outils de l'éditeur" className="flex flex-wrap gap-1 border-b p-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={toolbarBtn(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Gras"
          aria-label="Gras"
          aria-pressed={editor.isActive("bold")}
        >
          <Bold className="h-4 w-4" aria-hidden="true" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={toolbarBtn(editor.isActive("italic"))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italique"
          aria-label="Italique"
          aria-pressed={editor.isActive("italic")}
        >
          <Italic className="h-4 w-4" aria-hidden="true" />
        </Button>

        <div className="mx-1 w-px bg-border" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={toolbarBtn(editor.isActive("heading", { level: 1 }))}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          title="Titre 1"
          aria-label="Titre 1"
          aria-pressed={editor.isActive("heading", { level: 1 })}
        >
          <Heading1 className="h-4 w-4" aria-hidden="true" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={toolbarBtn(editor.isActive("heading", { level: 2 }))}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Titre 2"
          aria-label="Titre 2"
          aria-pressed={editor.isActive("heading", { level: 2 })}
        >
          <Heading2 className="h-4 w-4" aria-hidden="true" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={toolbarBtn(editor.isActive("heading", { level: 3 }))}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Titre 3"
          aria-label="Titre 3"
          aria-pressed={editor.isActive("heading", { level: 3 })}
        >
          <Heading3 className="h-4 w-4" aria-hidden="true" />
        </Button>

        <div className="mx-1 w-px bg-border" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={toolbarBtn(editor.isActive("bulletList"))}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Liste à puces"
          aria-label="Liste à puces"
          aria-pressed={editor.isActive("bulletList")}
        >
          <List className="h-4 w-4" aria-hidden="true" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={toolbarBtn(editor.isActive("orderedList"))}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Liste numérotée"
          aria-label="Liste numérotée"
          aria-pressed={editor.isActive("orderedList")}
        >
          <ListOrdered className="h-4 w-4" aria-hidden="true" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={toolbarBtn(editor.isActive("blockquote"))}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Citation"
          aria-label="Citation"
          aria-pressed={editor.isActive("blockquote")}
        >
          <Quote className="h-4 w-4" aria-hidden="true" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={toolbarBtn(editor.isActive("codeBlock"))}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          title="Bloc de code"
          aria-label="Bloc de code"
          aria-pressed={editor.isActive("codeBlock")}
        >
          <Code className="h-4 w-4" aria-hidden="true" />
        </Button>

        <div className="mx-1 w-px bg-border" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={toolbarBtn(editor.isActive("link"))}
          onClick={setLink}
          title="Lien"
          aria-label="Insérer un lien"
          aria-pressed={editor.isActive("link")}
        >
          <LinkIcon className="h-4 w-4" aria-hidden="true" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={toolbarBtn(false)}
          onClick={() => fileInputRef.current?.click()}
          title="Insérer une image"
          aria-label="Insérer une image"
        >
          <ImageIcon className="h-4 w-4" aria-hidden="true" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={toolbarBtn(false)}
          onClick={addYoutube}
          title="Intégrer YouTube"
          aria-label="Intégrer une vidéo YouTube"
        >
          <YoutubeIcon className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleImageFile}
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}
