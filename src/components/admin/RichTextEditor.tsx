import { useRef, useCallback, useEffect } from 'react';
import {
  Bold, Italic, Underline, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Link as LinkIcon, Undo, Redo,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

function ToolbarButton({ active, onClick, children, title }: {
  active?: boolean; onClick: () => void; children: React.ReactNode; title: string;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active
          ? 'bg-amber-500/20 text-amber-400'
          : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
      }`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isInitialized.current) {
      editorRef.current.innerHTML = content || '';
      isInitialized.current = true;
    }
  }, [content]);

  // When content changes externally (e.g. loading a post for editing)
  useEffect(() => {
    if (editorRef.current && isInitialized.current && content && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const exec = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const insertLink = useCallback(() => {
    const url = prompt('URL do link:');
    if (url) exec('createLink', url);
  }, [exec]);

  const s = 16;

  return (
    <div className="border border-border rounded-lg overflow-hidden focus-within:border-amber-500 transition-colors bg-[#0A0C0F]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-border bg-card">
        <ToolbarButton onClick={() => exec('bold')} title="Negrito">
          <Bold size={s} />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('italic')} title="Itálico">
          <Italic size={s} />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('underline')} title="Sublinhado">
          <Underline size={s} />
        </ToolbarButton>

        <div className="w-px h-5 bg-border mx-1" />

        <ToolbarButton onClick={() => exec('formatBlock', 'h1')} title="Título 1">
          <Heading1 size={s} />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('formatBlock', 'h2')} title="Título 2">
          <Heading2 size={s} />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('formatBlock', 'h3')} title="Título 3">
          <Heading3 size={s} />
        </ToolbarButton>

        <div className="w-px h-5 bg-border mx-1" />

        <ToolbarButton onClick={() => exec('insertUnorderedList')} title="Lista">
          <List size={s} />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('insertOrderedList')} title="Lista numerada">
          <ListOrdered size={s} />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('formatBlock', 'blockquote')} title="Citação">
          <Quote size={s} />
        </ToolbarButton>

        <div className="w-px h-5 bg-border mx-1" />

        <ToolbarButton onClick={insertLink} title="Link">
          <LinkIcon size={s} />
        </ToolbarButton>

        <div className="w-px h-5 bg-border mx-1" />

        <ToolbarButton onClick={() => exec('undo')} title="Desfazer">
          <Undo size={s} />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('redo')} title="Refazer">
          <Redo size={s} />
        </ToolbarButton>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[400px] px-4 py-3 text-foreground text-sm focus:outline-none prose prose-invert prose-sm max-w-none"
        style={{ minHeight: 400 }}
      />
    </div>
  );
}
