import {
  Autocomplete,
  Avatar,
  Chip,
  TextField,
  Typography,
  Box,
} from "@mui/material";

import { useState } from "react";

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  initials: string;
}

interface EditableAssignedTeamProps {
  value: TeamMember[];
  options: TeamMember[];
  onSave: (val: TeamMember[]) => void;
}

export const EditableAssignedTeam: React.FC<
  EditableAssignedTeamProps
> = ({ value, options, onSave }) => {
  const [editing, setEditing] = useState(false);

  if (!editing) {
    return (
      <Box
        onClick={() => setEditing(true)}
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          alignItems: "center",
          minHeight: 36,
          cursor: "pointer",
          px: 0.5,
          py: 0.5,
          borderRadius: "6px",

          "&:hover": {
            background: "#F8FAFC",
            outline: "1px solid #0078d4",
          },
        }}
      >
        {value.length ? (
          value.map((member) => (
            <Chip
              key={member.id}
              label={member.name}
              avatar={
                <Avatar
                  sx={{
                    width: 24,
                    height: 30,
                    fontSize: 11,
                    fontWeight: 700,
                    bgcolor: "#1a2c47",
                    color: "#fff !important",
                  }}
                >
                  {member.initials}
                </Avatar>
              }
              size="small"
              sx={{
                borderRadius: "20px",
                backgroundColor: "#EEF2FF",
                color: "#000",
                fontWeight: 500,
                height: 32,
              }}
            />
          ))
        ) : (
          <Typography
            sx={{
              fontSize: 14,
              color: "#fff",
            }}
          >
            Add team members
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Autocomplete
      multiple
      freeSolo
      autoFocus
      options={options}
      value={value}
      getOptionLabel={(option) =>
        typeof option === "string"
          ? option
          : option.name
      }
      onChange={(_, newValue) => {
        const formatted = newValue.map(
          (item, index) => {
            if (typeof item === "string") {
              return {
                id: Date.now() + index,
                name: item,
                role: "",
                initials: item
                  .split(" ")
                  .map((s) => s[0])
                  .join("")
                  .toUpperCase(),
              };
            }

            return item;
          },
        );

        onSave(formatted);
      }}
      onBlur={() => setEditing(false)}
  //     renderTags={(  tagValue: TeamMember[],
  // getTagProps: ({
  //   index,
  // }: {
  //   index: number;
  // }) => Record<string, unknown>,) =>
  //       tagValue.map((option, index) => (
  //         <Chip
  //           {...getTagProps({ index })}
  //           key={option.id}
  //           label={option.name}
  //           avatar={
  //             <Avatar
  //               sx={{
  //                 width: 24,
  //                 height: 24,
  //                 fontSize: 11,
  //                 fontWeight: 700,
  //                 bgcolor: "#0078d4",
  //                 color: "#fff",
  //               }}
  //             >
  //               {option.initials}
  //             </Avatar>
  //           }
  //           size="small"
  //           sx={{
  //             borderRadius: "16px",
  //             backgroundColor: "#EEF2FF",
  //             color: "#0078d4",
  //             fontWeight: 500,
  //             height: 32,
  //           }}
  //         />
  //       ))
      
  //       }
renderValue={(selected) =>
  (selected as TeamMember[]).map((option) => (
    <Chip
      key={option.id}
      label={option.name}
      avatar={
        <Avatar
          sx={{
            width: 24,
            height: 24,
            fontSize: 11,
            fontWeight: 700,
            bgcolor: "#fff",
           
          }}
        >
          {option.initials}
        </Avatar>
      }
      size="small"
      sx={{
        borderRadius: "16px",
        backgroundColor: "#EEF2FF",
        // color: "#0590fa",
        fontWeight: 500,
        height: 32,
        mr: 0.5,
      }}
    />
  ))
}
        renderInput={(params) => (
        <TextField
          {...params}
          autoFocus
          variant="outlined"
          placeholder="Assign team members"
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              minHeight: 42,
            },
          }}
        />
      )}
    />
  );
};