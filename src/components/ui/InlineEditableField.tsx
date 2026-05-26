// import { Typography } from "@mui/material";
// // import { useState } from "react";
// import { useState, useRef, useEffect } from "react";
// export const EditableField: React.FC<{
//   value: string;
//   onSave: (val: string) => void;
//   multiline?: boolean;
//   type?:string;
// }> = ({   value,
//   onSave,
//   multiline = false,
//   type = "text", }) => {
//   const [editing, setEditing] = useState(false);
//   const [localVal, setLocalVal] = useState(value);

// const inputRef = useRef<HTMLInputElement>(null);

// useEffect(() => {
//   if (editing && type === "date") {
//     inputRef.current?.showPicker?.();
//   }
// }, [editing, type]);

//   const handleBlur = () => {
//     setEditing(false);
//     onSave(localVal);
//   };

//  if (editing) {
//   // Convert DD-MM-YYYY → YYYY-MM-DD for the date input
//   const inputVal =
//     type === "date" && localVal.includes("-") && localVal.split("-")[2]?.length === 4
//       ? localVal.split("-").reverse().join("-")  // DD-MM-YYYY → YYYY-MM-DD
//       : localVal;

//   return (
//     <input
//       ref={inputRef}
//       type={type}
//       autoFocus
//       value={inputVal}
//       onChange={(e) => setLocalVal(e.target.value)}  // stores YYYY-MM-DD while editing
//       onBlur={handleBlur}
//       style={{
//         fontSize: "0.875rem",
//         padding: "2px 6px",
//         border: "1px solid #6366f1",
//         borderRadius: "6px",
//         outline: "none",
//         fontFamily: "inherit",
//         width: "100%",
//       }}
//     />
//   );
// }
//   return (
//     <Typography
//       onClick={() => setEditing(true)}
//       sx={{
//            textAlign:"left",
//      variant:"body2",
//       fontWeight:500,
//         cursor: "pointer",
//         borderRadius: "4px",
//         px: 0.5,
//         "&:hover": {
//           background: "#f1f5f9",
//           outline: "1px solid #6366f1",  
//         },
//       }}
//     >
//       {localVal || "—"}
//     </Typography>
//   );
// };




import { Typography } from "@mui/material";
import { useState, useRef, useEffect } from "react";

export const EditableField: React.FC<{
  value: string;
  onSave: (val: string) => void;
  multiline?: boolean;
  type?: string;
  fontSize?: string;
}> = ({ value, onSave, multiline = false, type = "text" ,  fontSize = "0.875rem",}) => {
  const [editing, setEditing] = useState(false);
  
  // displayVal is always what's shown in the Typography (DD-MM-YYYY for dates, raw for others)
  const [displayVal, setDisplayVal] = useState(value);
  
  // inputVal is always YYYY-MM-DD while the date input is open
  const [inputVal, setInputVal] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  // Sync display when parent value changes
  useEffect(() => {
    setDisplayVal(value);
  }, [value]);

  useEffect(() => {
    if (editing && type === "date") {
      inputRef.current?.showPicker?.();
    }
  }, [editing, type]);

  const handleClick = () => {
    if (type === "date") {
      // Convert DD-MM-YYYY → YYYY-MM-DD before opening picker
      const parts = value.split("-");
      const iso =
        parts.length === 3 && parts[2]?.length === 4
          ? `${parts[2]}-${parts[1]}-${parts[0]}`
          : value; // already ISO or empty
      setInputVal(iso);
    } else {
      setInputVal(value);
    }
    setEditing(true);
  };

  if (editing) {
    if (multiline) {
      return (
        <textarea
          autoFocus
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onBlur={() => {
            setDisplayVal(inputVal);
            setEditing(false);
            onSave(inputVal);
          }}
          style={{
            width: "100%",
            fontSize: "0.875rem",
            padding: "2px 6px",
            border: "1px solid #6366f1",
            borderRadius: "6px",
            outline: "none",
            resize: "vertical",
            fontFamily: "inherit",
            minHeight: "60px",
          }}
        />
      );
    }

    if (type === "date") {
      return (
        <input
          ref={inputRef}
          type="date"
          autoFocus
          value={inputVal}              // always YYYY-MM-DD
          onChange={(e) => {
            setInputVal(e.target.value); // keep as YYYY-MM-DD, don't convert yet
          }}
          onBlur={(e) => {
            const iso = e.target.value; // YYYY-MM-DD
            if (!iso) {
              setEditing(false);
              return;
            }
            // Convert to DD-MM-YYYY for display only
            const [y, m, d] = iso.split("-");
            const display = `${d}-${m}-${y}`;
            setDisplayVal(display);
            setEditing(false);
            onSave(iso); // send ISO to parent so calendar moves correctly
          }}
          style={{
            fontSize,
            padding: "2px 6px",
            border: "1px solid #6366f1",
            borderRadius: "6px",
            outline: "none",
            fontFamily: "inherit",
            width: "fit-content",
          }}
        />
      );
    }

    // Plain text input
    return (
      <input
        type={type}
        autoFocus
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onBlur={() => {
          setDisplayVal(inputVal);
          setEditing(false);
          onSave(inputVal);
        }}
        style={{
          fontSize,
          padding: "2px 6px",
          border: "1px solid #6366f1",
          borderRadius: "6px",
          outline: "none",
          fontFamily: "inherit",
          width: "fit-content",
        }}
      />
    );
  }

  return (
    <Typography
      onClick={handleClick}
      sx={{
        fontSize,
        textAlign: "left",
        fontWeight: 500,
        cursor: "pointer",
        borderRadius: "4px",
        px: 0.5,
        "&:hover": {
          background: "#f1f5f9",
          outline: "1px solid #6366f1",
        },
      }}
    >
      {displayVal || "—"}
    </Typography>
  );
};