import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
// import Image from "@tiptap/extension-image";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { createPortal } from "react-dom";

// Remove this:
// import Image from "@tiptap/extension-image";

// Add this:
import { ImageResize } from "tiptap-extension-resize-image";
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
  type MouseEvent,
  type CSSProperties,
} from "react";
import type {
  SuggestionKeyDownProps,
  SuggestionProps,
} from "@tiptap/suggestion";

const PEOPLE = ["Alice Johnson", "Bob Smith", "Carol White", "David Brown", "Eve Davis"];
const WORK_ITEMS = ["#1023 – Login bug", "#1024 – Dashboard redesign", "#1025 – API refactor", "#1026 – Unit tests"];
const EMOJI_LIST = ["😀","😂","😍","🎉","👍","🔥","✅","❌","⚠️","📌","🚀","💡","📝","🐛","🎯","💬","🔗","📎","🗓️","⏰"];
const FONT_COLORS = ["#EF4444","#F97316","#EAB308","#22C55E","#3B82F6","#8B5CF6","#EC4899","#000000","#6B7280"];
const HIGHLIGHT_COLORS = ["#FEF08A","#BBF7D0","#BAE6FD","#FBCFE8","#E9D5FF","#FED7AA","#FECDD3"];

interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
}

function buildSuggestion(items: string[], char: string) {
  return {
    char,
    items: ({ query }: { query: string }): string[] =>
      items.filter((item) => item.toLowerCase().includes(query.toLowerCase())).slice(0, 6),
    render: () => {
      let el: HTMLDivElement | null = null;
      let onKeyDown: ((event: KeyboardEvent) => boolean) | undefined;
      let selectedIndex = 0;

      const renderList = (container: HTMLDivElement, props: SuggestionProps): void => {
        container.innerHTML = "";
        if (!props.items.length) { container.style.display = "none"; return; }
        container.style.display = "";
        const rect = props.clientRect?.();
        if (rect) {
          container.style.cssText = `position:fixed;top:${rect.bottom + 6}px;left:${rect.left}px;z-index:9999;display:block;`;
        }
        (props.items as string[]).forEach((item, index) => {
          const btn = document.createElement("button");
          btn.className = "mention-item" + (index === selectedIndex ? " selected" : "");
          btn.textContent = item;
          btn.onmousedown = (e): void => { e.preventDefault(); props.command({ id: item, label: item }); };
          container.appendChild(btn);
        });
        onKeyDown = (event: KeyboardEvent): boolean => {
          const len = (props.items as string[]).length;
          if (event.key === "ArrowUp") { selectedIndex = (selectedIndex - 1 + len) % len; renderList(container, props); return true; }
          if (event.key === "ArrowDown") { selectedIndex = (selectedIndex + 1) % len; renderList(container, props); return true; }
          if (event.key === "Enter") { props.command({ id: (props.items as string[])[selectedIndex], label: (props.items as string[])[selectedIndex] }); return true; }
          return false;
        };
      };

      return {
        onStart: (props: SuggestionProps): void => {
          selectedIndex = 0;
          el = document.createElement("div");
          el.className = "mention-list";
          document.body.appendChild(el);
          renderList(el, props);
        },
        onUpdate: (props: SuggestionProps): void => { selectedIndex = 0; if (el) renderList(el, props); },
        onKeyDown: (props: SuggestionKeyDownProps): boolean => onKeyDown?.(props.event) ?? false,
        onExit: (): void => { el?.remove(); el = null; },
      };
    },
  };
}

interface BtnProps {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: ReactNode;
  disabled?: boolean;
}

function Btn({ onClick, active = false, title, children, disabled = false }: BtnProps) {
  return (
    <button
      type="button"
      onMouseDown={(e: MouseEvent<HTMLButtonElement>): void => { e.preventDefault(); if (!disabled) onClick(); }}
      onMouseEnter={(e: MouseEvent<HTMLButtonElement>): void => { if (!active && !disabled) e.currentTarget.style.background = "#F3F4F6"; }}
      onMouseLeave={(e: MouseEvent<HTMLButtonElement>): void => { if (!active && !disabled) e.currentTarget.style.background = "transparent"; }}
      disabled={disabled}
      title={title}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 28, height: 28, borderRadius: 4, border: "none",
        cursor: disabled ? "default" : "pointer",
        background: active ? "#E8F0FE" : "transparent",
        color: active ? "#1a56db" : "#374151",
        fontSize: 13, fontWeight: 600, transition: "background 0.12s",
        opacity: disabled ? 0.4 : 1, flexShrink: 0,
      }}
    >{children}</button>
  );
}

function Divider() {
  return <div style={{ width: 1, height: 20, background: "#E5E7EB", margin: "0 2px", flexShrink: 0 }} />;
}

const Icons = {
  Bold: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>,
  Italic: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>,
  Strike: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.3 4.9c-2.3-.6-4.4-1-6.2-.9-2.7 0-5.3.7-5.3 3.6 0 1.5 1.1 2.6 3.3 3.2l3 .8"/><path d="m7 15c.9 2.5 3.4 3.5 6.7 3.5s5.3-1.9 5.3-4.2c0-1.4-.3-2.5-2.3-3.3"/><line x1="4" y1="12" x2="20" y2="12"/></svg>,
  Underline: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>,
  BulletList: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>,
  OrderedList: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>,
  Indent: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><polyline points="9 12 13 15 9 18"/><line x1="13" y1="15" x2="3" y2="15"/><line x1="3" y1="21" x2="21" y2="21"/></svg>,
  Outdent: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><polyline points="7 12 3 15 7 18"/><line x1="3" y1="15" x2="13" y2="15"/><line x1="3" y1="21" x2="21" y2="21"/></svg>,
  Link: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  Image: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Emoji: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
  Highlight: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>,
  FontColor: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>,
  ThreeDots: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>,
  ClearFormat: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V4h16v3"/><path d="M5 20h6"/><path d="M13 4l-6 16"/><line x1="18" y1="12" x2="22" y2="16"/><line x1="22" y1="12" x2="18" y2="16"/></svg>,
  MentionPerson: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/></svg>,
  MentionItem: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/></svg>,
};

export default function RichTextEditor({ value = "", onChange }: RichTextEditorProps) {
  const [isExpanded, setIsExpanded]       = useState(false);
  const [showEmojiPicker, setShowEmoji]   = useState(false);
  const [showFontColor, setShowFontColor] = useState(false);
  const [showHighlight, setShowHL]        = useState(false);
  const [showOverflow, setShowOF]         = useState(false);

  // ── Link modal ──────────────────────────────────────
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl]             = useState("");
  const [linkText, setLinkText]           = useState("");

  // ── Image modal ─────────────────────────────────────
  // const [showImageModal, setShowImageModal] = useState(false);
  // const [imageUrl, setImageUrl]             = useState("");

  // ── Image modal ─────────────────────────────────────
const [showImageModal, setShowImageModal] = useState(false);
const [imageUrl, setImageUrl]             = useState("");   // ← add this line if missing
const imageInputRef = useRef<HTMLInputElement>(null);       // ← add this too

  const overflowRef = useRef<HTMLDivElement>(null);

    const wrapperRef = useRef<HTMLDivElement>(null);  // ← add this

  // ← add this effect
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handler as unknown as EventListener);
    return () => document.removeEventListener("mousedown", handler as unknown as EventListener);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false }),
      ImageResize,
      Placeholder.configure({
  placeholder: "Click here to add description",
}),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Mention.configure({
        HTMLAttributes: { class: "mention-person" },
        suggestion: buildSuggestion(PEOPLE, "@"),
      }),
      Mention.extend({ name: "mentionWorkItem" }).configure({
        HTMLAttributes: { class: "mention-work-item" },
        suggestion: buildSuggestion(WORK_ITEMS, "#"),
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => { onChange?.(editor.getHTML()); },
    onFocus: () => setIsExpanded(true),
    editorProps: {
      attributes: {
        style: "outline:none;min-height:120px;font-size:14px;line-height:1.7;color:#111827;font-family:'Segoe UI',sans-serif;",
      },
    },
  });

  // Sync content if value changes externally
  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value ?? "");
    }
  }, [value, editor]);

  // Close popups on outside click
  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      if (!(e.target as Element).closest(".popup-area")) {
        setShowEmoji(false);
        setShowFontColor(false);
        setShowHL(false);
        setShowOF(false);
      }
    };
    document.addEventListener("mousedown",handler as unknown as EventListener);
    return () => document.removeEventListener("mousedown", handler as unknown as EventListener);
  }, []);

  // ── Handlers ────────────────────────────────────────

  const handleSetLink = useCallback((): void => {
    if (!editor || !linkUrl) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
    setShowLinkModal(false);
    setLinkUrl("");
    setLinkText("");
  }, [editor, linkUrl]);

  // const handleInsertImage = (): void => {
  //   if (!editor || !imageUrl) return;
  //   editor.chain().focus().setImage({ src: imageUrl }).run();
  //   setImageUrl("");
  //   setShowImageModal(false);
  // };

  const handleInsertImage = (file: File): void => {
  if (!editor) return;
  const url = URL.createObjectURL(file);
  editor.chain().focus().setImage({ src: url }).run();
  setShowImageModal(false);
};

  const clearFormatting = (): void => {
    if (!editor) return;
    editor.chain().focus().clearNodes().unsetAllMarks().run();
    setShowOF(false);
  };

  if (!editor) return null;

  const headingValue = (): string => {
    if (editor.isActive("heading", { level: 1 })) return "h1";
    if (editor.isActive("heading", { level: 2 })) return "h2";
    if (editor.isActive("heading", { level: 3 })) return "h3";
    return "p";
  };

  const handleHeadingChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const v = e.target.value;
    if (v === "p") { editor.chain().focus().setParagraph().run(); }
    else { editor.chain().focus().toggleHeading({ level: parseInt(v.replace("h", ""), 10) as 1 | 2 | 3 }).run(); }
  };

  const toolbarStyle: CSSProperties = {
    display: "flex", alignItems: "center", flexWrap: "wrap",
    gap: 2, padding: "6px 8px",
    borderBottom: "1px solid #E5E7EB", background: "#F9FAFB",
  };

  return (
    <div 
       ref={wrapperRef}   // ← attach ref
    style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <style>{`
        /* Image resize styles */
  .ProseMirror img {
    max-width: 100%;
    height: auto;
    cursor: pointer;
    border-radius: 4px;
  }

  .ProseMirror img.ProseMirror-selectednode {
    outline: 2px solid #0078d4;
  }

  .image-resizer {
    display: inline-flex;
    position: relative;
    flex-grow: 0;
    max-width: 100%;
  }

  .image-resizer img {
    display: block;
  }

  .image-resizer__handle {
    position: absolute;
    width: 10px;
    height: 10px;
    background: #0078d4;
    border: 2px solid #fff;
    border-radius: 2px;
    z-index: 10;
  }

  .image-resizer__handle--tl { top: -5px;    left: -5px;    cursor: nwse-resize; }
  .image-resizer__handle--tr { top: -5px;    right: -5px;   cursor: nesw-resize; }
  .image-resizer__handle--bl { bottom: -5px; left: -5px;    cursor: nesw-resize; }
  .image-resizer__handle--br { bottom: -5px; right: -5px;   cursor: nwse-resize; }
        .tiptap-wrapper { border:1px solid #D1D5DB; border-radius:4px; overflow:visible; background:#fff; }
        .tiptap-wrapper:focus-within { border-color:#0078d4; box-shadow:0 0 0 1px #0078d4; }
        .ProseMirror p.is-editor-empty:first-child::before { content:attr(data-placeholder); color:#9CA3AF; pointer-events:none; float:left; height:0; }
        .ProseMirror { padding:10px 12px; }
        .ProseMirror p { margin:0 0 4px; }
        .ProseMirror h1 { font-size:22px; font-weight:600; margin:8px 0 4px; }
        .ProseMirror h2 { font-size:18px; font-weight:600; margin:8px 0 4px; }
        .ProseMirror h3 { font-size:16px; font-weight:600; margin:8px 0 4px; }
        .ProseMirror ul, .ProseMirror ol { padding-left:24px; }
        .ProseMirror ul li { list-style-type: disc; }
        .ProseMirror ol li { list-style-type: decimal; }
        .ProseMirror a { color:#0078d4; text-decoration:underline; }
        .mention-person { background:#dbeafe; color:#1d4ed8; border-radius:3px; padding:0 3px; font-weight:500; font-size:13px; }
        .mention-work-item { background:#ede9fe; color:#6d28d9; border-radius:3px; padding:0 3px; font-weight:500; font-size:13px; }
        .mention-list { background:#fff; border:1px solid #D1D5DB; border-radius:6px; padding:4px; box-shadow:0 4px 16px rgba(0,0,0,.12); min-width:180px; }
        .mention-item { display:block; width:100%; text-align:left; padding:6px 10px; background:transparent; border:none; border-radius:4px; cursor:pointer; font-size:13px; color:#111827; }
        .mention-item.selected, .mention-item:hover { background:#F3F4F6; }
        .color-swatch { width:20px; height:20px; border-radius:3px; border:1px solid rgba(0,0,0,.15); cursor:pointer; transition:transform .1s; flex-shrink:0; }
        .color-swatch:hover { transform:scale(1.2); }
        .overflow-menu { position:absolute; background:#fff; border:1px solid #E5E7EB; border-radius:6px; box-shadow:0 4px 16px rgba(0,0,0,.12); padding:4px; z-index:100; min-width:180px; top:100%; right:0; margin-top:4px; }
        .overflow-item { display:flex; align-items:center; gap:8px; width:100%; padding:7px 12px; background:transparent; border:none; border-radius:4px; cursor:pointer; font-size:13px; color:#374151; text-align:left; font-family:'Segoe UI',sans-serif; }
        .overflow-item:hover { background:#F3F4F6; }
        .popup-panel { position:absolute; background:#fff; border:1px solid #E5E7EB; border-radius:6px; box-shadow:0 4px 16px rgba(0,0,0,.12); padding:8px; z-index:100; top:100%; margin-top:4px; }

.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.3); z-index:99999; display:flex; align-items:center; justify-content:center; }
.modal-box { background:#fff; border-radius:8px; padding:20px 24px; width:360px; box-shadow:0 8px 32px rgba(0,0,0,.18); position:relative; z-index:100000; }
        .modal-box h3 { margin:0 0 14px; font-size:15px; font-weight:600; color:#111827; }
        .modal-input { width:100%; box-sizing:border-box; border:1px solid #D1D5DB; border-radius:4px; padding:7px 10px; font-size:13px; margin-bottom:10px; outline:none; font-family:'Segoe UI',sans-serif; }
        .modal-input:focus { border-color:#0078d4; }
        .modal-actions { display:flex; gap:8px; justify-content:flex-end; }
        .btn-primary { padding:6px 16px; background:#0078d4; color:#fff; border:none; border-radius:4px; cursor:pointer; font-size:13px; }
        .btn-primary:hover { background:#006cc1; }
        .btn-cancel { padding:6px 16px; background:transparent; border:1px solid #D1D5DB; border-radius:4px; cursor:pointer; font-size:13px; color:#374151; }
        .btn-cancel:hover { background:#F3F4F6; }
        .emoji-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:4px; }
        .emoji-btn { background:transparent; border:none; cursor:pointer; font-size:18px; padding:4px; border-radius:4px; line-height:1; }
        .emoji-btn:hover { background:#F3F4F6; }
        .char-count { font-size:11px; color:#9CA3AF; text-align:right; padding:4px 8px 2px; border-top:1px solid #F3F4F6; }
      `}</style>

      <div className="tiptap-wrapper">
        {isExpanded && (
          <div style={toolbarStyle}>
            <select
              style={{ height:26, fontSize:12, border:"1px solid #E5E7EB", borderRadius:4, padding:"0 4px", background:"#fff", color:"#374151", cursor:"pointer" }}
              value={headingValue()}
              onChange={handleHeadingChange}
            >
              <option value="p">Paragraph</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
            </select>

            <Divider />

            <Btn onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive("bold")}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              title="Bold (Ctrl+B)"><Icons.Bold /></Btn>

            <Btn onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive("italic")}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              title="Italic (Ctrl+I)"><Icons.Italic /></Btn>

            <Btn onClick={() => editor.chain().focus().toggleUnderline().run()}
              active={editor.isActive("underline")}
              disabled={!editor.can().chain().focus().toggleUnderline().run()}
              title="Underline (Ctrl+U)"><Icons.Underline /></Btn>

            <Btn onClick={() => editor.chain().focus().toggleStrike().run()}
              active={editor.isActive("strike")}
              disabled={!editor.can().chain().focus().toggleStrike().run()}
              title="Strikethrough"><Icons.Strike /></Btn>

            <Divider />

            {/* Font color */}
            <div style={{ position:"relative" }} className="popup-area">
              <Btn
                onClick={() => { setShowFontColor(!showFontColor); setShowHL(false); setShowEmoji(false); setShowOF(false); }}
                active={showFontColor} title="Font Color"
              ><Icons.FontColor /></Btn>
              {showFontColor && (
                <div className="popup-panel" style={{ left:0 }}>
                  <div style={{ fontSize:11, color:"#6B7280", marginBottom:6 }}>Font Color</div>
                  <div style={{ display:"flex", gap:4, flexWrap:"wrap", width:120 }}>
                    {FONT_COLORS.map((c) => (
                      <div key={c} className="color-swatch" style={{ background:c }}
                        onClick={() => { editor.chain().focus().setColor(c).run(); setShowFontColor(false); }} />
                    ))}
                    <div className="color-swatch"
                      style={{ background:"transparent", border:"1px dashed #9CA3AF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#6B7280" }}
                      onClick={() => { editor.chain().focus().unsetColor().run(); setShowFontColor(false); }}>✕</div>
                  </div>
                </div>
              )}
            </div>

            {/* Highlight */}
            <div style={{ position:"relative" }} className="popup-area">
              <Btn
                onClick={() => { setShowHL(!showHighlight); setShowFontColor(false); setShowEmoji(false); setShowOF(false); }}
                active={editor.isActive("highlight")} title="Highlight Color"
              ><Icons.Highlight /></Btn>
              {showHighlight && (
                <div className="popup-panel" style={{ left:0 }}>
                  <div style={{ fontSize:11, color:"#6B7280", marginBottom:6 }}>Highlight</div>
                  <div style={{ display:"flex", gap:4, flexWrap:"wrap", width:140 }}>
                    {HIGHLIGHT_COLORS.map((c) => (
                      <div key={c} className="color-swatch" style={{ background:c }}
                        onClick={() => { editor.chain().focus().toggleHighlight({ color:c }).run(); setShowHL(false); }} />
                    ))}
                    <div className="color-swatch"
                      style={{ background:"transparent", border:"1px dashed #9CA3AF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#6B7280" }}
                      onClick={() => { editor.chain().focus().unsetHighlight().run(); setShowHL(false); }}>✕</div>
                  </div>
                </div>
              )}
            </div>

            <Divider />

            {/* ── Bullet & Numbered lists — fixed ── */}
            <Btn
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive("bulletList")}
              disabled={!editor.can().chain().focus().toggleBulletList().run()}
              title="Bullet List"
            ><Icons.BulletList /></Btn>

            <Btn
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive("orderedList")}
              disabled={!editor.can().chain().focus().toggleOrderedList().run()}
              title="Numbered List"
            ><Icons.OrderedList /></Btn>

            <Divider />

            <Btn onClick={() => editor.chain().focus().sinkListItem("listItem").run()}
              disabled={!editor.can().sinkListItem("listItem")}
              title="Increase Indent"><Icons.Indent /></Btn>

            <Btn onClick={() => editor.chain().focus().liftListItem("listItem").run()}
              disabled={!editor.can().liftListItem("listItem")}
              title="Decrease Indent"><Icons.Outdent /></Btn>

            <Divider />

            {/* Emoji */}
            <div style={{ position:"relative" }} className="popup-area">
              <Btn
                onClick={() => { setShowEmoji(!showEmojiPicker); setShowFontColor(false); setShowHL(false); setShowOF(false); }}
                active={showEmojiPicker} title="Emoji"
              ><Icons.Emoji /></Btn>
              {showEmojiPicker && (
                <div className="popup-panel" style={{ left:0, width:164 }}>
                  <div className="emoji-grid">
                    {EMOJI_LIST.map((e) => (
                      <button key={e} type="button" className="emoji-btn"
                        onClick={() => { editor.chain().focus().insertContent(e).run(); setShowEmoji(false); }}
                      >{e}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Divider />

            {/* Three-dot overflow */}
            <div style={{ position:"relative", marginLeft:"auto" }} className="popup-area" ref={overflowRef}>
              <Btn
                onClick={() => { setShowOF(!showOverflow); setShowEmoji(false); setShowFontColor(false); setShowHL(false); }}
                active={showOverflow} title="More options"
              ><Icons.ThreeDots /></Btn>
              {showOverflow && (
                <div className="overflow-menu popup-area">
                  <button type="button" className="overflow-item"
                    onClick={() => { editor.chain().focus().insertContent("@").run(); setShowOF(false); }}>
                    <Icons.MentionPerson /> Mention someone
                  </button>
                  <button type="button" className="overflow-item"
                    onClick={() => { editor.chain().focus().insertContent("#").run(); setShowOF(false); }}>
                    <Icons.MentionItem /> Mention work item
                  </button>
                  <div style={{ borderTop:"1px solid #E5E7EB", margin:"4px 0" }} />
                  {/* ── Insert link — fixed ── */}
                  <button type="button" className="overflow-item"
                    onClick={() => { setShowLinkModal(true); setShowOF(false); }}>
                    <Icons.Link /> Insert link
                  </button>
                  {/* ── Insert image — fixed ── */}
                  <button type="button" className="overflow-item"
                    onClick={() => { setShowImageModal(true); setShowOF(false); }}>
                    <Icons.Image /> Insert image
                  </button>
                  <div style={{ borderTop:"1px solid #E5E7EB", margin:"4px 0" }} />
                  <button type="button" className="overflow-item" onClick={clearFormatting}>
                    <Icons.ClearFormat /> Clear formatting
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <EditorContent editor={editor}   onClick={() => {
    setIsExpanded(true);
    editor?.commands.focus();
  }} />

        {isExpanded && (
          <div className="char-count">{editor.getText().length} characters</div>
        )}
      </div>

{/* ── Link modal ──────────────────────── */}
{showLinkModal && createPortal(
  <div className="modal-overlay" onClick={() => setShowLinkModal(false)}>
    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
      <h3>Insert Link</h3>
      <input
        className="modal-input"
        placeholder="Display text (optional)"
        value={linkText}
        onChange={(e) => setLinkText(e.target.value)}
      />
      <input
        className="modal-input"
        placeholder="https://..."
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") handleSetLink(); }}
        autoFocus
      />
      <div className="modal-actions">
        <button type="button" className="btn-cancel" onClick={() => setShowLinkModal(false)}>Cancel</button>
        <button type="button" className="btn-primary" onClick={handleSetLink}>Insert</button>
      </div>
    </div>
  </div>,
  document.body
)}

{/* ── Image modal ─────────────────────── */}
{/* {showImageModal && createPortal(
  <div className="modal-overlay" onClick={() => setShowImageModal(false)}>
    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
      <h3>Insert Image</h3>
      <input
        className="modal-input"
        placeholder="https://example.com/image.png"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") handleInsertImage(); }}
        autoFocus
      />
      <div className="modal-actions">
        <button type="button" className="btn-cancel" onClick={() => setShowImageModal(false)}>Cancel</button>
        <button type="button" className="btn-primary" onClick={handleInsertImage}>Insert</button>
      </div>
    </div>
  </div>,
  document.body
)} */}

{/* Hidden file input for image upload */}
<input
  ref={imageInputRef}
  type="file"
  accept="image/*"
  style={{ display: "none" }}
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) handleInsertImage(file);
    e.target.value = ""; // reset so same file can be picked again
  }}
/>

{/* ── Image modal ─────────────────────── */}
{showImageModal && createPortal(
  <div className="modal-overlay" onClick={() => setShowImageModal(false)}>
    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
      <h3>Insert Image</h3>

      {/* Option 1 — upload from device */}
      <button
        type="button"
        onClick={() => {
          setShowImageModal(false);
          setTimeout(() => imageInputRef.current?.click(), 100);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
          padding: "10px 14px",
          marginBottom: 10,
          border: "1px solid #D1D5DB",
          borderRadius: 6,
          background: "#f9fafb",
          cursor: "pointer",
          fontSize: 13,
          color: "#374151",
          fontFamily: "'Segoe UI', sans-serif",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        Upload from device
      </button>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
        <span style={{ fontSize: 11, color: "#9CA3AF" }}>or paste URL</span>
        <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
      </div>

      {/* Option 2 — paste URL */}
      <input
        className="modal-input"
        placeholder="https://example.com/image.png"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && imageUrl) {
            if (!editor) return;
            editor.chain().focus().setImage({ src: imageUrl }).run();
            setImageUrl("");
            setShowImageModal(false);
          }
        }}
        autoFocus
      />

      <div className="modal-actions">
        <button
          type="button"
          className="btn-cancel"
          onClick={() => { setShowImageModal(false); setImageUrl(""); }}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn-primary"
          disabled={!imageUrl}
          onClick={() => {
            if (!editor || !imageUrl) return;
            editor.chain().focus().setImage({ src: imageUrl }).run();
            setImageUrl("");
            setShowImageModal(false);
          }}
          style={{ opacity: imageUrl ? 1 : 0.5, cursor: imageUrl ? "pointer" : "default" }}
        >
          Insert
        </button>
      </div>
    </div>
  </div>,
  document.body
)}
    </div>
  );
}