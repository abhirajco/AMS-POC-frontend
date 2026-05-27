import { Label } from "./label";
import TagInput from "./TagInput";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

const LabeledTagInput = ({ tags, onChange,}: TagInputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Label>Tags</Label>

      <TagInput
        tags={tags}
        onChange={onChange}
      />
    </div>
  );
};

export default LabeledTagInput;