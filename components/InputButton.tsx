import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";

const InputButton: React.FC = () => {
  return (
    <IconButton type="submit" size="small">
      <AddIcon />
    </IconButton>
  );
};

export default InputButton;
