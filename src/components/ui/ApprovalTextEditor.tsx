import { Lock, LockOpen, TextFields } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import type { EditorOptions } from "@tiptap/core";
import { useCallback, useRef, useState, useEffect } from "react";
import { LinkBubbleMenu, MenuButton, RichTextEditor, RichTextReadOnly, TableBubbleMenu, insertImages, type RichTextEditorRef, } from "mui-tiptap";
import EditorMenuControls from "./EditorMenuControls";
import useExtensions from "@/hooks/useExtension";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
//import { useEffect } from "react";
import { BASE_URL } from "@/utils/BASE_URL";
import { toast } from "sonner";
import { getCsrfToken } from "@/utils/csrf";

function fileListToImageFiles(fileList: FileList): File[] {
  return Array.from(fileList).filter((file) => {
    const mimeType = (file.type || "").toLowerCase();
    return mimeType.startsWith("image/");
  });
}
type props = {
  contentTitle: string;
  contentBody: string;
  contentId: string;
   onChange: (html: string) => void;
}

export default function ApprovalTextEditor({ contentTitle, contentBody, contentId, onChange }: props) {

  const extensions = useExtensions({
    placeholder: "Start writing your content here, or use AI generated to get started...",
  });
  const rteRef = useRef<RichTextEditorRef>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [showMenuBar, setShowMenuBar] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [title, setTitle] = useState(contentTitle);

  useEffect(() => {
    setTitle(contentTitle);
  }, [contentTitle]);


  const toggleLock = async () => {
    if (!contentId) 
      {
    console.error("No contentId found");
    return;
  }
    try {
      const res = await fetch(`${BASE_URL}/content/contents/${contentId}/lock/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCsrfToken(),
          },
        }
      );

     if (!res.ok) {
  toast.error("You do not have authority to unlock.");
  return;
}
      const data =await res.json()
      console.log(data);
      setIsEditable((prev) => !prev);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (rteRef.current?.editor && contentBody) {
      const current = rteRef.current.editor.getHTML();

      if (current !== contentBody) {
        rteRef.current.editor.commands.setContent(contentBody);
      }
    }
  }, [contentBody]);

  const handleNewImageFiles = useCallback(
    (files: File[], insertPosition?: number): void => {
      if (!rteRef.current?.editor) {
        return;
      }

      const attributesForImageFiles = files.map((file) => ({
        src: URL.createObjectURL(file),
        alt: file.name,
      }));

      insertImages({
        images: attributesForImageFiles,
        editor: rteRef.current.editor,
        position: insertPosition,
      });
    },
    []
  );

  const handleDrop: NonNullable<EditorOptions["editorProps"]["handleDrop"]> =
    useCallback(
      (view, event, _slice, _moved) => {
        if (!(event instanceof DragEvent) || !event.dataTransfer) {
          return false;
        }

        const imageFiles = fileListToImageFiles(event.dataTransfer.files);
        if (imageFiles.length > 0) {
          const insertPosition = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          })?.pos;

          handleNewImageFiles(imageFiles, insertPosition);
          event.preventDefault();
          return true;
        }

        return false;
      },
      [handleNewImageFiles]
    );

  const handlePaste: NonNullable<EditorOptions["editorProps"]["handlePaste"]> =
    useCallback(
      (_view, event, _slice) => {
        if (!event.clipboardData) {
          return false;
        }

        const pastedImageFiles = fileListToImageFiles(
          event.clipboardData.files
        );
        if (pastedImageFiles.length > 0) {
          handleNewImageFiles(pastedImageFiles);
          return true;
        }
        return false;
      },
      [handleNewImageFiles]
    );

  return (
    <div className={isFullScreen ? "fixed inset-0 z-[1300] bg-white p-4 flex flex-col h-screen overflow-hidden" : ""}>

      {/* TITLE */}
      <div className="w-full mb-4">
        <input
          type="text"
          placeholder="Content title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded border-gray-300 py-1 px-3 w-full mt-3"
        />
      </div>

      {/* EDITOR  */}
      <div className={isFullScreen ? "flex-1 flex flex-col overflow-hidden" : ""}>

        <RichTextEditor
          ref={rteRef}
          extensions={extensions}
          editable={isEditable}
          content={contentBody}
          onUpdate={({ editor }) => {
            onChange(editor.getHTML());
          }}
          editorProps={{
            handleDrop: handleDrop,
            handlePaste: handlePaste,
          }}
          renderControls={() => <EditorMenuControls />}
          RichTextFieldProps={{
            variant: "outlined",
            MenuBarProps: {
              hide: !showMenuBar,
            },
          }}
          sx={{
            display: "flex",
            flexDirection: "column",

            "& .MuiOutlinedInput-root": {
              display: "flex",
              flexDirection: "column",
              height: isFullScreen ? "100%" : "auto",
            },

            "& .ProseMirror": {
              overflowY: "auto",
              maxHeight: isFullScreen ? "calc(100vh - 180px)" : "250px",
              minHeight: isFullScreen ? "400px" : "250px",
              padding: "17px",
            },
             "& ul, & ol": {
              paddingLeft: "24px",
              marginLeft: "0px",
            },

            "& li": {
              marginTop: "4px",
              marginBottom: "4px",
            },
          }}
        >
          {() => (
            <>
              <LinkBubbleMenu />
              <TableBubbleMenu />
            </>
          )}
        </RichTextEditor>

      </div>

      {/* FOOTER */}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          py: 1,
          px: 1.5,
          backgroundColor: "white",
          flexShrink: 0,
        }}
      > 
        <MenuButton
          value="fullscreen"
          tooltipLabel={isFullScreen ? "Exit Full Screen" : "Full Screen"}
          size="small"
          onClick={() => setIsFullScreen(prev => !prev)}
          selected={isFullScreen}
          IconComponent={isFullScreen ? FullscreenExitIcon : FullscreenIcon}
        />
      </Stack>

    </div>
  );

}


