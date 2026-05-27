import { KeyboardEvent, useRef, useState } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

const TagInput = ({ tags, onChange, placeholder = "Add tags (space or comma)", }: TagInputProps) => {

  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const addTag = (raw: string) => {
    const value = raw.trim().replace(/,$/, "").trim();

    if (value && !tags.includes(value)) {
      onChange([...tags, value]);
    }

    setInputValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    }

    else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }

    else if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (val.includes(",")) {
      const parts = val.split(",");

      const last = parts.pop() ?? "";

      parts.forEach((part) => addTag(part));

      setInputValue(last);
    } else {
      setInputValue(val);
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className=" flex flex-wrap items-center gap-2 min-h-[42px] rounded-md border border-input bg-background px-3 py-2 cursor-text focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      {tags.map((tag, index) => (
        <div
          key={index}
          className=" inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-1  text-sm font-medium text-blue-950 ">
          <span>{tag}</span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(index);
            }}
            className="text-muted-foreground hover:text-destructive transition-colors">
            <X size={14} />
          </button>
        </div>
      ))}

      <input
        ref={inputRef}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (inputValue.trim()) {
            addTag(inputValue);
          }
        }}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[120px] bg-transparent text-sm outline-none  placeholder:text-muted-foreground" />
    </div>
  );
};

export default TagInput;