import React from "react";
import { IconButton } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";

const DoneButton: React.FC = () => {
  return (
    <IconButton
      type="button"
      sx={{
        borderColor: "rgba(0,0,0,0.8)",
        "&:hover": {
          cursor: "pointer",
          background: "rgba(61,196,59,0.2)",
        },
      }}
    >
      <DoneIcon />
    </IconButton>
  );
};

export default DoneButton;
